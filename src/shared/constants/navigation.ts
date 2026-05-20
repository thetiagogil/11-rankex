export const protectedNavLinks = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/explore", icon: "explore", label: "Explore" },
] as const;

export type ProtectedNavLink = (typeof protectedNavLinks)[number];
