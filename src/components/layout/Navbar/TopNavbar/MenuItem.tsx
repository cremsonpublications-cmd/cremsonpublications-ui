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
  isActive?: boolean;
};

export function MenuItem({ label, url, isActive }: MenuItemProps) {
  return (
    <NavigationMenuItem>
      <Link to={url ?? "/"}>
        <NavigationMenuLink
          className={cn([
            navigationMenuTriggerStyle(),
            "font-[500] px-3 transition-colors duration-300",
            isActive ? "text-red-500 hover:text-red-500" : "text-black hover:text-gray-600"
          ])}
        >
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
