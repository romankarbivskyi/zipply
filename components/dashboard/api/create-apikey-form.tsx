"use client";

import { createApiKey } from "@/actions/api";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiKeyInput, apiKeySchema } from "@/schemas/apikey";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

const CreateApiKeyForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState("");

  const form = useForm<ApiKeyInput>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ApiKeyInput) => {
    startTransition(async () => {
      const res = await createApiKey(data);

      if (!res.success) {
        form.setError("name", { message: res.error });
        return;
      }

      form.reset();
      setCreatedKey(res.key);
      setIsOpen(true);
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Create API Key</h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end gap-4"
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter key name (e.g. My App Key)"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit" disabled={isPending}>
              Create API Key
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Your API key has been created successfully. Please copy and store
              it securely as it will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-end gap-2">
            <Input
              type="text"
              readOnly
              value={createdKey}
              className="w-full select-all"
            />
            <CopyButton text={createdKey} variant="outline" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateApiKeyForm;
