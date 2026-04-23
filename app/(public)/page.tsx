import { LinkIcon, Zap, Shield } from "lucide-react";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";

export default function Home() {
  return (
    <div className="w-full flex-1 overflow-hidden">
      <Hero />
      <Features />
    </div>
  );
}
