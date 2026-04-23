import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export const getApiKeys = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  const apiKeys = await prisma.apiKey.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return apiKeys;
};
