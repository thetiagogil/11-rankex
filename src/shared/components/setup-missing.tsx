import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { Card } from "@/shared/components/ui/card";

const envRows = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    value: "Required",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    value: "Required",
  },
];

export const SetupMissing = () => {
  return (
    <AppShell>
      <AppHeader
        actions={
          <span className="text-accent font-mono text-[10px] tracking-[0.25em] uppercase">
            setup
          </span>
        }
      />

      <AppMain className="flex flex-1 items-center justify-center pb-12">
        <Card
          as="section"
          className="w-full max-w-md p-8"
          gradient
          tone="primary"
        >
          <div className="relative">
            <div className="text-accent mb-2 font-mono text-[10px] tracking-[0.25em] uppercase">
              &gt; setup required
            </div>
            <h1 className="font-display text-glow-primary mb-5 text-2xl">
              CONFIGURE SUPABASE
            </h1>
            <p className="text-muted-foreground text-sm leading-6">
              Rankex is ready to use the shared Supabase project. Add these
              public client credentials to <code>.env.local</code>.
            </p>

            <div className="border-border bg-background/50 mt-6 overflow-hidden rounded-md border">
              {envRows.map((row) => (
                <div
                  className="border-border flex min-w-0 flex-col gap-1 border-b px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                  key={row.name}
                >
                  <span className="text-foreground font-mono text-xs break-all">
                    {row.name}
                  </span>
                  <span className="text-accent font-mono text-[10px] tracking-wider uppercase">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </AppMain>
    </AppShell>
  );
};
