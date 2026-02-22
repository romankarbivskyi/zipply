"use client";

import { authSchema, AuthSchema } from "@/schemas/auth";
import { GoogleIcon } from "./icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const isSignIn = type === "sign-in";

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });
  };

  const handleSubmit = ({ email, password }: AuthSchema) => {
    startTransition(async () => {
      try {
        if (isSignIn) {
          const { error } = await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
            callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
          });

          if (error) throw new Error(error.message);
        } else {
          const name = email.split("@")[0];

          const { error } = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
          });

          if (error) throw new Error(error.message);

          router.push("/dashboard");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        );
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isSignIn ? "👋 Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {isSignIn
            ? "Welcome back! Please enter your details."
            : "Let's get you set up with a new account."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon />
          Google
        </Button>

        <div className="flex items-center gap-1">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-sm">OR</span>
          <Separator className="flex-1" />
        </div>

        <form id="auth-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email address"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <Button
          form="auth-form"
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isSignIn ? "Sign In" : "Create Account"}
        </Button>
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-muted-foreground text-sm hover:underline"
        >
          {isSignIn
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
