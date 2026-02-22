import { Code2, Home, LinkIcon, SlidersHorizontal } from "lucide-react";

export const DASHBOARD_NAVIGATION: {
  title: string;
  href: string;
  icon: React.ComponentType;
  tags?: {
    title: string;
    variant:
      | "outline"
      | "link"
      | "default"
      | "secondary"
      | "destructive"
      | "ghost";
  }[];
}[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Links",
    href: "/dashboard/links",
    icon: LinkIcon,
  },
  {
    title: "API Keys",
    href: "/dashboard/api-keys",
    icon: Code2,
    tags: [
      {
        title: "Soon",
        variant: "secondary",
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: SlidersHorizontal,
  },
];
