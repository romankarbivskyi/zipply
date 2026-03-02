import Heading from "@/components/dashboard/heading";
import LinkForm from "@/components/dashboard/links/link-form";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Create New" />
      <div className="p-4">
        <LinkForm type="create" />
      </div>
    </div>
  );
}
