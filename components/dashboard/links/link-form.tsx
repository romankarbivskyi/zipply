"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";
import type { Link } from "@/lib/generated/prisma/client";

interface LinkFormProps {
  type?: "create" | "edit";
  link?: Link;
}

const LinkForm = ({ type = "create", link }: LinkFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;
    const shortCode = formData.get("shortCode") as string;

    startTransition(async () => {
      setError(null);

      const res = await fetch(
        type === "edit" ? `/api/v1/links/${link!.id}` : "/api/v1/links",
        {
          method: type === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, shortCode }),
        },
      );

      const json = await res.json();

      if (!res.ok) {
        const msg =
          typeof json.error === "string" ? json.error : "Something went wrong";
        setError(msg);
        return;
      }

      toast.success(type === "edit" ? "Link updated" : "Link created");
      router.push("/dashboard/links");
      router.refresh();
    });
  };

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>{type === "create" ? "Create" : "Edit"} Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com/very-long-url"
              defaultValue={link?.originalUrl}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="shortCode">
              Custom Short Code{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="shortCode"
              name="shortCode"
              placeholder="my-link"
              maxLength={20}
              defaultValue={link?.shortCode}
            />
            <p className="text-muted-foreground text-xs">
              Leave empty to auto-generate. Letters, numbers, hyphens, and
              underscores only.
            </p>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <IconLoader2 className="size-4 animate-spin" />}
            {isPending && type === "create"
              ? "Creating..."
              : isPending && type === "edit"
                ? "Updating..."
                : type === "create"
                  ? "Create Link"
                  : "Update Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LinkForm;
