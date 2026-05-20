export const protectedNavLinks = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/explore", icon: "explore", label: "Explore" },
  { href: "/profile", icon: "profile", label: "Profile" },
] as const;

export type ProtectedNavLink = (typeof protectedNavLinks)[number];
