import Heading from "@/components/dashboard/heading";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Heading title="API Keys" />
      <div className="flex flex-1 items-center justify-center p-4">
        <h1 className="text-2xl font-bold">
          API - <span className="font-thin italic">Coming Soon</span>
        </h1>
      </div>
    </div>
  );
}
