import { prisma } from "@/lib/db";
import { createLinkSchema } from "@/schemas/link";
import { getMetadata } from "@/lib/metadata";
import { nanoid } from "nanoid";
import {
  resolveApiSession,
  unauthorized,
  badRequest,
  notFound,
} from "@/lib/api-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = async (_req: Request, { params }: RouteContext) => {
  const session = await resolveApiSession(_req);
  if (!session) return unauthorized();

  const { id } = await params;

  const link = await prisma.link.findUnique({
    where: { id, userId: session.userId },
  });
  if (!link) return notFound();

  return Response.json({ data: link });
};

export const PATCH = async (req: Request, { params }: RouteContext) => {
  const session = await resolveApiSession(req);
  if (!session) return unauthorized();

  const { id } = await params;

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

  const existing = await prisma.link.findUnique({
    where: { id, userId: session.userId },
  });
  if (!existing) return notFound();

  const conflict = await prisma.link.findFirst({
    where: { shortCode: code, id: { not: id } },
  });
  if (conflict) return badRequest("This short code is already taken");

  const metadata = await getMetadata(url);
  const title = metadata?.title || `${url} - untitled`;
  const favicon = metadata?.touchIcon;

  const link = await prisma.link.update({
    where: { id },
    data: { originalUrl: url, shortCode: code, title, favicon },
  });

  return Response.json({ data: link });
};

export const DELETE = async (req: Request, { params }: RouteContext) => {
  const session = await resolveApiSession(req);
  if (!session) return unauthorized();

  const { id } = await params;

  const existing = await prisma.link.findUnique({
    where: { id, userId: session.userId },
  });
  if (!existing) return notFound();

  await prisma.link.delete({ where: { id } });

  return Response.json({ success: true });
};
