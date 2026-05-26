type ProfileStatProps = {
  label: string;
  value: number;
};

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div className="min-w-0">
      <p className="font-display text-foreground text-xl leading-none font-bold">
        {value}
      </p>
      <p className="text-muted-foreground mt-1 truncate font-mono text-[10px] tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}
