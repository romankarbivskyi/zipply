"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiKeyInput, apiKeySchema } from "@/schemas/apikey";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcrypt";
import { headers } from "next/headers";

export const createApiKey = async (data: ApiKeyInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const validatedData = apiKeySchema.safeParse(data);

  if (!validatedData.success) {
    return { error: "Invalid input" };
  }

  const existingKeys = await prisma.apiKey.count({
    where: {
      userId: session.user.id,
    },
  });

  if (existingKeys >= 5) {
    return { error: "You can only have 5 API keys" };
  }

  const prefix = "zipply_" + createId();
  const secret = createId();

  const key = `${prefix}.${secret}`;
  const hashedKey = await bcrypt.hash(key, 10);

  await prisma.apiKey.create({
    data: {
      name: validatedData.data.name,
      prefix,
      key: hashedKey,
      userId: session.user.id,
    },
  });

  return { success: true, key };
};

export const updateApiKey = async (id: string, data: ApiKeyInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const validatedData = apiKeySchema.safeParse(data);

  if (!validatedData.success) {
    return { error: "Invalid input" };
  }

  await prisma.apiKey.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      name: validatedData.data.name,
    },
  });

  return { success: true };
};

export const deleteApiKey = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  await prisma.apiKey.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  return { success: true };
};
