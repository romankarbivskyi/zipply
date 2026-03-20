"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">
        404 - <span className="font-thin italic">Link Not Found</span>
      </h1>
      <Button variant="outline" className="ml-4" onClick={() => router.back()}>
        Go Back
      </Button>
    </div>
  );
}
