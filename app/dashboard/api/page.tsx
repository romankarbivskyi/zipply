import ApiKeyList from "@/components/dashboard/api/api-key-list";
import CreateApiKeyForm from "@/components/dashboard/api/create-api-key-form";
import Heading from "@/components/dashboard/heading";
import { getApiKeys } from "@/data/api-key";

export default async function Page() {
  const apiKeys = await getApiKeys();

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <Heading title="API" />
      <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-4 p-4">
        <CreateApiKeyForm />
        <ApiKeyList data={apiKeys} />
      </div>
    </div>
  );
}
