import Heading from "@/components/dashboard/heading";
import CreateLinkForm from "@/components/dashboard/links/create-link-form";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Create New" />
      <div className="p-4">
        <CreateLinkForm />
      </div>
    </div>
  );
}
