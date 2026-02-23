"use client";

import { useActionState } from "react";
import { createLink } from "@/actions/links";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLoader2 } from "@tabler/icons-react";

const CreateLinkForm = () => {
  const [state, action, isPending] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const result = await createLink(formData);
      return result ?? null;
    },
    null,
  );

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create Short Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com/very-long-url"
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
            />
            <p className="text-muted-foreground text-xs">
              Leave empty to auto-generate. Letters, numbers, hyphens, and
              underscores only.
            </p>
          </div>

          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <IconLoader2 className="size-4 animate-spin" />}
            {isPending ? "Creating..." : "Create Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateLinkForm;
