import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="container mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="bg-secondary text-secondary-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold shadow-sm sm:mb-8 sm:text-sm">
        <Zap className="size-3 sm:size-4" />
        <span>Lightning fast link infrastructure</span>
      </div>

      <h1 className="mb-6 max-w-4xl px-2 text-4xl leading-[1.1] font-extrabold tracking-tighter text-balance sm:mb-8 sm:text-5xl md:text-7xl">
        Make every <span className="text-primary italic">link</span> work{" "}
        <span className="decoration-primary underline decoration-[4px] underline-offset-4 sm:decoration-[6px] sm:underline-offset-8">
          harder
        </span>{" "}
        with Zipply.
      </h1>

      <p className="text-muted-foreground mb-10 w-full max-w-2xl px-2 text-base leading-relaxed font-medium text-pretty sm:mb-12 sm:text-lg md:text-xl">
        Zipply strips away the noise, delivering an uncompromisingly fast and
        brutally minimal platform to shorten, track, and manage your URLs at
        scale.
      </p>

      <div className="flex w-full flex-col gap-3 px-4 sm:w-auto sm:flex-row sm:gap-4 sm:px-0">
        <Button
          asChild
          size="lg"
          className="shadow-primary/20 group h-12 w-full rounded-full px-8 text-sm font-bold shadow-lg sm:h-14 sm:w-auto sm:text-base"
        >
          <Link href="/sign-up">
            Start for free
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1 sm:size-5" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 w-full rounded-full border-2 px-8 text-sm font-bold sm:h-14 sm:w-auto sm:text-base"
        >
          <Link href="/docs">View API Docs</Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
