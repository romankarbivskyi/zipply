import { getLinkByShortCode } from "@/data/links";
import { notFound, redirect } from "next/navigation";

interface LinkRedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LinkRedirectPage({
  params,
}: LinkRedirectPageProps) {
  const { slug } = await params;

  const link = await getLinkByShortCode(slug);

  if (!link) {
    notFound();
  }

  redirect(link.originalUrl);
}
