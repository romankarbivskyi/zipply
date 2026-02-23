import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const LINKS_PER_PAGE = 10;

export async function fetchFilteredLinks(search: string, currentPage: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const offset = (currentPage - 1) * LINKS_PER_PAGE;

  const links = await prisma.link.findMany({
    where: {
      userId: session.user.id,
      ...(search
        ? {
            OR: [
              { originalUrl: { contains: search, mode: "insensitive" } },
              { shortCode: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: LINKS_PER_PAGE,
  });

  return links;
}

export async function fetchLinksPages(search: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return 0;
  }

  const count = await prisma.link.count({
    where: {
      userId: session.user.id,
      ...(search
        ? {
            OR: [
              { originalUrl: { contains: search, mode: "insensitive" } },
              { shortCode: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });

  return Math.ceil(count / LINKS_PER_PAGE);
}
