"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    startTransition(async () => {
      const token = new URLSearchParams(window.location.search).get("token");

      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token: token || undefined,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password.");
        return;
      }

      setIsSuccess(true);
      toast.success("Password successfully changed!");
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Set new password</CardTitle>
        <CardDescription>
          {isSuccess
            ? "Your password has been changed. You can now sign in."
            : "Type your new password below to regain access to your account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <Button onClick={() => router.push("/sign-in")} className="w-full">
            Go to Sign In
          </Button>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                    <Input
                      {...field}
                      id="new-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your new password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confirm-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm your new password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update Password"}
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
