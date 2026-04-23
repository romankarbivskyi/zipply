import AuthForm from "@/components/auth/auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to start managing your Zipply links.",
};
export default function Page() {
  return <AuthForm type="sign-up" />;
}
