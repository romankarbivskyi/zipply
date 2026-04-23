import { LinkIcon, Zap, Shield } from "lucide-react";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import FAQ from "@/components/sections/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fastest URL Shortener",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="w-full flex-1 overflow-hidden">
      <Hero />
      <Features />
      <FAQ />
    </div>
  );
}
