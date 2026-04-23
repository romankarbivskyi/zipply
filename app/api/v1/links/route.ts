import { prisma } from "@/lib/db";
import { createLinkSchema } from "@/schemas/link";
import { getMetadata } from "@/lib/metadata";
import { nanoid } from "nanoid";
import { LINKS_PER_PAGE } from "@/constants";
import { resolveApiSession, unauthorized, badRequest } from "@/lib/api-auth";

export const GET = async (req: Request) => {
  const session = await resolveApiSession(req);
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const offset = (page - 1) * LINKS_PER_PAGE;

  const where = {
    userId: session.userId,
    ...(search
      ? {
          OR: [
            { originalUrl: { contains: search, mode: "insensitive" as const } },
            { shortCode: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: LINKS_PER_PAGE,
    }),
    prisma.link.count({ where }),
  ]);

  return Response.json({
    data: links,
    pagination: {
      page,
      totalPages: Math.ceil(total / LINKS_PER_PAGE),
      total,
    },
  });
};

export const POST = async (req: Request) => {
  const session = await resolveApiSession(req);
  if (!session) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const parsed = createLinkSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { url, shortCode } = parsed.data;
  const code = shortCode || nanoid(7);

  const existing = await prisma.link.findFirst({ where: { shortCode: code } });
  if (existing) return badRequest("This short code is already taken");

  const metadata = await getMetadata(url);
  const title = metadata?.title || `${url} - untitled`;
  const favicon = metadata?.touchIcon;

  const link = await prisma.link.create({
    data: {
      originalUrl: url,
      shortCode: code,
      userId: session.userId,
      title,
      favicon,
    },
  });

  return Response.json({ data: link }, { status: 201 });
};

export const DELETE = async (req: Request) => {
  const session = await resolveApiSession(req);
  if (!session) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const ids = (body as { ids?: unknown }).ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return badRequest("ids must be a non-empty array");
  }

  await prisma.link.deleteMany({
    where: { id: { in: ids as string[] }, userId: session.userId },
  });

  return Response.json({ success: true });
};
