"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiKeyInput, apiKeySchema } from "@/schemas/apikey";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateApiKey } from "@/actions/api-key";
import { toast } from "sonner";

interface RenameApiKeyDialogProps {
  id: string;
  name: string;
}

const RenameApiKeyDialog = ({ id, name }: RenameApiKeyDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const form = useForm<ApiKeyInput>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name,
    },
  });

  const watchedName = useWatch({ control: form.control, name: "name" });

  const onSubmit = (data: ApiKeyInput) => {
    startTransition(async () => {
      const res = await updateApiKey(id, data);

      if (!res.success) {
        form.setError("name", { message: res.error });
        return;
      }

      form.reset();
      setIsOpen(false);
      toast.success("Renamed successfully");
      router.refresh();
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pen />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename API Key</DialogTitle>
          <DialogDescription>
            Enter a new name for your API key.
          </DialogDescription>
        </DialogHeader>
        <form
          id="rename-api-key-form"
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
        </form>
        <DialogFooter>
          <Button
            type="submit"
            variant="outline"
            form="rename-api-key-form"
            disabled={isPending || name === watchedName}
          >
            Rename
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameApiKeyDialog;
