import { getProfileInitials } from "@/shared/utils/profile";
import { cn } from "@/shared/utils/cn";

type ProfileAvatarProps = {
  className?: string;
  displayName: string;
  rounded?: "2xl" | "3xl" | "full";
  size?: "lg" | "md" | "sm" | "xl" | "xs";
  tone?: "gradient" | "muted" | "primary";
};

const sizeClasses: Record<NonNullable<ProfileAvatarProps["size"]>, string> = {
  lg: "size-16 text-3xl",
  md: "size-14 text-2xl",
  sm: "size-10 text-lg",
  xl: "size-28 text-5xl sm:size-36 sm:text-6xl",
  xs: "size-8 text-[10px]",
};

const roundedClasses: Record<
  NonNullable<ProfileAvatarProps["rounded"]>,
  string
> = {
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const toneClasses: Record<NonNullable<ProfileAvatarProps["tone"]>, string> = {
  gradient:
    "border-foreground/45 bg-gradient-gold text-primary-foreground shadow-none",
  muted: "border-foreground/45 bg-secondary text-foreground shadow-none",
  primary: "border-primary bg-primary text-primary-foreground shadow-none",
};

export const ProfileAvatar = ({
  className,
  displayName,
  rounded = "2xl",
  size = "md",
  tone = "gradient",
}: ProfileAvatarProps) => {
  return (
    <span
      className={cn(
        "font-display grid shrink-0 place-items-center border font-black",
        sizeClasses[size],
        roundedClasses[rounded],
        toneClasses[tone],
        className,
      )}
    >
      {getProfileInitials(displayName)}
    </span>
  );
};
