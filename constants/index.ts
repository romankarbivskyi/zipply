import { BookOpen, Code2, Home, LinkIcon } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType;
  openInNewTab?: boolean;
}

export const DASHBOARD_NAVIGATION: NavItem[] = [
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
    title: "API",
    href: "/dashboard/api",
    icon: Code2,
  },
  {
    title: "Docs",
    href: "/docs",
    icon: BookOpen,
    openInNewTab: true,
  },
];

export const LINKS_PER_PAGE = 5;
