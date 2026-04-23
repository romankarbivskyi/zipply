import { Metadata } from "next";
import Heading from "@/components/dashboard/heading";

export const metadata: Metadata = {
  title: "Settings",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Settings" />
      <div className="p-4">Settings</div>
    </div>
  );
}
