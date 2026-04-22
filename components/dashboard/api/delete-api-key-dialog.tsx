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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteApiKey } from "@/actions/api-key";

interface DeleteApiKeyDialogProps {
  id: string;
}

const DeleteApiKeyDialog = ({ id }: DeleteApiKeyDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const onSubmit = () => {
    startTransition(async () => {
      const res = await deleteApiKey(id);

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      setIsOpen(false);
      toast.success("Deleted successfully");
      router.refresh();
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete API Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this API key? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={onSubmit}
            disabled={isPending}
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteApiKeyDialog;
