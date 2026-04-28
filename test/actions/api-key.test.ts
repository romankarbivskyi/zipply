import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createApiKey, updateApiKey, deleteApiKey } from "@/actions/api-key";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    apiKey: {
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Map()),
}));

const mockGetSession = auth.api.getSession as unknown as Mock;
const mockApiKeyCount = prisma.apiKey.count as Mock;
const mockApiKeyCreate = prisma.apiKey.create as Mock;

describe("api-key actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createApiKey", () => {
    it("returns error if no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const res = await createApiKey({ name: "Test Key" });
      expect(res).toEqual({ error: "Unauthorized" });
    });

    it("returns error if invalid input", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "usr_1" } });
      const res = await createApiKey({} as { name: string });
      expect(res).toEqual({ error: "Invalid input" });
    });

    it("returns error if too many keys", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "usr_1" } });
      mockApiKeyCount.mockResolvedValue(5);
      const res = await createApiKey({ name: "Test Key" });
      expect(res).toEqual({ error: "You can only have 5 API keys" });
    });

    it("creates key and returns success", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "usr_1" } });
      mockApiKeyCount.mockResolvedValue(0);
      mockApiKeyCreate.mockResolvedValue({ id: "key_1" });

      const res = await createApiKey({ name: "Test Key" });
      expect(res.success).toBe(true);
      expect(res.key).toBeDefined();
      expect(prisma.apiKey.create).toHaveBeenCalled();
    });
  });

  describe("updateApiKey", () => {
    it("returns error if no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const res = await updateApiKey("key_1", { name: "New Name" });
      expect(res).toEqual({ error: "Unauthorized" });
    });

    it("updates key successfully", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "usr_1" } });

      const res = await updateApiKey("key_1", { name: "New Name" });
      expect(res).toEqual({ success: true });
      expect(prisma.apiKey.update).toHaveBeenCalled();
    });
  });

  describe("deleteApiKey", () => {
    it("returns error if no session", async () => {
      mockGetSession.mockResolvedValue(null);
      const res = await deleteApiKey("key_1");
      expect(res).toEqual({ error: "Unauthorized" });
    });

    it("deletes key successfully", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "usr_1" } });

      const res = await deleteApiKey("key_1");
      expect(res).toEqual({ success: true });
      expect(prisma.apiKey.delete).toHaveBeenCalled();
    });
  });
});
