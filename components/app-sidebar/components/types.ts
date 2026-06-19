import { LucideIcon } from "lucide-react";

export interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      icon: LucideIcon;
      url: string;
    }[];
  }[];
}

export interface NavProjectsProps {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}

export interface NavSecondaryProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}
