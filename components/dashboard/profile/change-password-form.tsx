"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { updatePasswordSchema } from "@/schemas/auth";

type ChangePasswordFormValues = z.infer<typeof updatePasswordSchema>;

const ChangePasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password changed successfully");
        form.reset();
        router.refresh();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Field data-invalid={form.formState.errors.currentPassword}>
            <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
            <PasswordInput
              {...form.register("currentPassword")}
              id="current-password"
              aria-invalid={!!form.formState.errors.currentPassword}
              placeholder="Enter your current password"
            />
            {form.formState.errors.currentPassword && (
              <FieldError errors={[form.formState.errors.currentPassword]} />
            )}
          </Field>

          <Field data-invalid={form.formState.errors.newPassword}>
            <FieldLabel htmlFor="new-password">New Password</FieldLabel>
            <PasswordInput
              {...form.register("newPassword")}
              id="new-password"
              aria-invalid={!!form.formState.errors.newPassword}
              placeholder="Enter your new password"
            />
            {form.formState.errors.newPassword && (
              <FieldError errors={[form.formState.errors.newPassword]} />
            )}
          </Field>

          <Field data-invalid={form.formState.errors.confirmPassword}>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <PasswordInput
              {...form.register("confirmPassword")}
              id="confirm-password"
              aria-invalid={!!form.formState.errors.confirmPassword}
              placeholder="Confirm your new password"
            />
            {form.formState.errors.confirmPassword && (
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            )}
          </Field>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
