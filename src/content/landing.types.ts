import type { LucideIcon } from "lucide-react";

export type LandingFeatureCard = {
  accent: string;
  description: string;
  icon: LucideIcon;
  tilt: string;
  title: string;
};

export type LandingSampleRanking = {
  accent: string;
  icon: LucideIcon;
  items: string[];
  title: string;
  topic: string;
};

export type LandingSampleDeckLayout = {
  left: number;
  rotate: number;
  top: number;
};
