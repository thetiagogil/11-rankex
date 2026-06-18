import type { ReactNode } from "react";

type SettingsSectionProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export const SettingsSection = ({
  children,
  description,
  title,
}: SettingsSectionProps) => {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
};
