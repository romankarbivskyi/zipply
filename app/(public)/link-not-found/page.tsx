import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Link Not Found",
};

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-7xl font-extrabold">404</h1>
      <p className="text-muted-foreground text-lg">
        This short link does not exist or has been removed.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Go to Zipply</Link>
      </Button>
    </div>
  );
}
