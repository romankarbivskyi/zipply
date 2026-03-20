import Heading from "@/components/dashboard/heading";
import LinkForm from "@/components/dashboard/links/link-form";
import { getLinkById } from "@/data/links";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const linkId = (await params).id;
  const link = await getLinkById(linkId);

  if (!link) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Edit Link" />
      <div className="p-4">
        <LinkForm type="edit" link={link} />
      </div>
    </div>
  );
}
