import AuthForm from "@/components/auth/auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to manage your Zipply links and API keys.",
};
export default function Page() {
  return <AuthForm type="sign-in" />;
}
