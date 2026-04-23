import Link from "next/link";
import { LogoIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-background w-full border-t py-12 sm:py-16">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        <div className="space-y-6 sm:col-span-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tighter sm:gap-3"
          >
            <div className="bg-foreground text-background rounded-lg p-1 sm:p-1.5">
              <LogoIcon className="size-5" />
            </div>
            Zipply
          </Link>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            A brutally fast, uncompromisingly simple link management platform.
            Built for performance and designed for scale.
          </p>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-sm font-bold tracking-widest uppercase">Legal</h3>
          <ul className="space-y-3 sm:space-y-4">
            <li>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-sm font-bold tracking-widest uppercase">
            Product
          </h3>
          <ul className="space-y-3 sm:space-y-4">
            <li>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                API Documentation
              </Link>
            </li>
            <li>
              <Link
                href="/sign-up"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-muted-foreground container mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t px-4 pt-8 text-center text-xs font-medium sm:mt-16 sm:px-6 md:flex-row md:text-left">
        <p>© {new Date().getFullYear()} Zipply. All rights reserved.</p>
      </div>
    </footer>
  );
}
