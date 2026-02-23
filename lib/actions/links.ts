"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createLinkSchema } from "@/schemas/link";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export async function createLink(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const raw = {
    url: formData.get("url") as string,
    shortCode: formData.get("shortCode") as string,
  };

  const parsed = createLinkSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  const { url, shortCode } = parsed.data;
  const code = shortCode || nanoid(7);

  const existing = await prisma.link.findFirst({
    where: { shortCode: code },
  });

  if (existing) {
    return { error: "This short code is already taken" };
  }

  await prisma.link.create({
    data: {
      originalUrl: url,
      shortCode: code,
      userId: session.user.id,
    },
  });

  redirect("/dashboard/links");
}
