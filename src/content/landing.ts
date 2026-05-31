import {
  Clapperboard,
  Compass,
  Gamepad2,
  Heart,
  List,
  Music,
  Users,
} from "lucide-react";

import type {
  LandingFeatureCard,
  LandingSampleDeckLayout,
  LandingSampleRanking,
} from "@/content/landing.types";

export const landingFeatureCards: LandingFeatureCard[] = [
  {
    accent: "oklch(0.78 0.1 50)",
    description:
      "Build lists for anything, from your favorite artists to your favorite games.",
    icon: List,
    tilt: "tilt-l",
    title: "Ranked lists",
  },
  {
    accent: "oklch(0.68 0.09 245)",
    description:
      "Discover your friends tastes and find new favorites through their rankings.",
    icon: Compass,
    tilt: "tilt-r",
    title: "Explore feed",
  },
  {
    accent: "oklch(0.78 0.06 320)",
    description:
      "Follow people, like their lists, and remix them into your own canon.",
    icon: Users,
    tilt: "tilt-l",
    title: "Follow people",
  },
  {
    accent: "oklch(0.78 0.07 150)",
    description:
      "Engage with the community by liking, commenting, and remixing lists you love.",
    icon: Heart,
    tilt: "tilt-r",
    title: "Like, remix, comment",
  },
];

export const landingSampleRankings: LandingSampleRanking[] = [
  {
    accent: "oklch(0.78 0.1 50)",
    icon: Clapperboard,
    items: ["Attack on Titan", "Demon Slayer", "My Hero Academia"],
    title: "GOTY 2025",
    topic: "Games",
  },
  {
    accent: "oklch(0.78 0.06 320)",
    icon: Music,
    items: ["Blackbear", "Sueco", "Creepy Nuts"],
    title: "Best artists",
    topic: "Artists",
  },
  {
    accent: "oklch(0.68 0.09 245)",
    icon: Gamepad2,
    items: ["Assassin's Creed", "Pokemon", "Grand Theft Auto"],
    title: "Best game franchises",
    topic: "Games",
  },
];

export const landingSampleDeckLayout: LandingSampleDeckLayout[] = [
  { left: 20, rotate: -7, top: 0 },
  { left: 124, rotate: 4, top: 78 },
  { left: 42, rotate: -3, top: 172 },
];

export const defaultLandingSampleDeckLayout: LandingSampleDeckLayout =
  landingSampleDeckLayout[0] ?? {
    left: 20,
    rotate: -7,
    top: 0,
  };

export const marqueeTopics = [
  "Films",
  "Games",
  "Albums",
  "Restaurants",
  "Books",
  "Cities",
  "TV shows",
  "Podcasts",
  "Comics",
  "Anime",
  "Hobbies",
  "Cars",
  "Recipes",
  "Songs",
  "Artists",
  "Memes",
  "Destinations",
  "Sports teams",
  "Cryptocurrencies",
  "Board games",
  "Fitness routines",
  "Superheroes",
  "Villains",
  "TV characters",
];

const marqueeTopicCopies = 12;

export const marqueeTopicLoop = Array.from(
  { length: marqueeTopicCopies },
  (_, copyIndex) =>
    marqueeTopics.map((topic, topicIndex) => ({
      copyIndex,
      topic,
      topicIndex,
    })),
).flat();
