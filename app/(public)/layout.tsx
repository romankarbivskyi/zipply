import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="selection:bg-foreground selection:text-background flex min-h-screen w-full flex-col font-sans">
      <Navbar />
      <main className="flex w-full flex-1 items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
