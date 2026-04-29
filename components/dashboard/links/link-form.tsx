"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";
import { createLinkSchema, type CreateLinkInput } from "@/schemas/link";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

interface LinkFormProps {
  type?: "create" | "edit";
  link?: {
    id: string;
    originalUrl: string;
    shortCode: string;
    tags: string[];
  };
}

const LinkForm = ({ type = "create", link }: LinkFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      url: link?.originalUrl || "",
      shortCode: link?.shortCode || "",
      tags: link?.tags?.join(", ") || "",
    },
  });

  const onSubmit = (data: CreateLinkInput) => {
    startTransition(async () => {
      const res = await fetch(
        type === "edit" ? `/api/v1/links/${link!.id}` : "/api/v1/links",
        {
          method: type === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Something went wrong");
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="url">Destination URL</FieldLabel>
                  <Input
                    {...field}
                    id="url"
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="shortCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="shortCode">
                    Custom Short Code{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="shortCode"
                    placeholder="my-link"
                    maxLength={20}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Leave empty to auto-generate. Letters, numbers, hyphens, and
                    underscores only.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tags">Tags</FieldLabel>
                  <Input
                    {...field}
                    id="tags"
                    placeholder="marketing, social, dev"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Separate tags with commas.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default LinkForm;
