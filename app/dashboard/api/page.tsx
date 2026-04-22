import CreateApiKeyForm from "@/components/dashboard/api/create-apikey-form";
import Heading from "@/components/dashboard/heading";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Heading title="API" />
      <div className="p-4">
        <CreateApiKeyForm />
      </div>
    </div>
  );
}
