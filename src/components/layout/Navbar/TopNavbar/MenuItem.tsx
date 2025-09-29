import * as React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  label: string;
  url?: string;
};

export function MenuItem({ label, url }: MenuItemProps) {
  return (
    <NavigationMenuItem>
      <Link to={url ?? "/"}>
        <NavigationMenuLink
          className={cn([navigationMenuTriggerStyle(), "font-normal px-3"])}
        >
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
