import { LinkIcon, Zap, Shield } from "lucide-react";

const Features = () => {
  return (
    <section className="bg-muted/40 w-full border-y">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3">
          <div className="space-y-5">
            <div className="bg-foreground text-background flex size-14 items-center justify-center rounded-2xl shadow-md">
              <LinkIcon className="size-7" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Frictionless Links
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Generate concise URLs instantly. No bloated dashboards or
              confusing metrics. Just raw, unadulterated speed.
            </p>
          </div>
          <div className="space-y-5">
            <div className="bg-foreground text-background flex size-14 items-center justify-center rounded-2xl shadow-md">
              <Zap className="size-7" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Robust API
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Integrate seamlessly into any pipeline. Our REST endpoints are
              explicitly built for high output and minimal latency.
            </p>
          </div>
          <div className="space-y-5">
            <div className="bg-foreground text-background flex size-14 items-center justify-center rounded-2xl shadow-md">
              <Shield className="size-7" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Secure by Default
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Your data is locked down. From API keys to user sessions, we
              ensure end-to-end security without compromising agility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
