import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons";

export function Navbar() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tighter sm:gap-3 sm:text-2xl"
        >
          <LogoIcon className="size-5 sm:size-6" />
          Zipply
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/sign-in"
            className="hover:text-foreground/80 text-sm font-semibold transition-colors hover:underline"
          >
            Log in
          </Link>
          <Button
            asChild
            className="h-9 rounded-full px-4 text-xs font-bold sm:h-10 sm:px-6 sm:text-sm"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
