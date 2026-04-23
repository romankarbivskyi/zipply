import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import bcrypt from "bcrypt";

export interface ApiSession {
  userId: string;
}

const validateApiKey = async (rawKey: string): Promise<ApiSession | null> => {
  const dotIndex = rawKey.indexOf(".", rawKey.indexOf("_") + 1);
  if (dotIndex === -1) return null;

  const prefix = rawKey.slice(0, dotIndex);
  const record = await prisma.apiKey.findFirst({ where: { prefix } });
  if (!record) return null;

  const valid = await bcrypt.compare(rawKey, record.key);
  if (!valid) return null;

  return { userId: record.userId };
};

export const resolveApiSession = async (
  req: Request,
): Promise<ApiSession | null> => {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return validateApiKey(authHeader.slice(7).trim());
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) return { userId: session.user.id };
  } catch {}

  return null;
};

export const unauthorized = () =>
  Response.json({ error: "Unauthorized" }, { status: 401 });

export const badRequest = (error: string) =>
  Response.json({ error }, { status: 400 });

export const notFound = (error = "Not found") =>
  Response.json({ error }, { status: 404 });
