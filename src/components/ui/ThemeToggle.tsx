"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import Button from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const items = ['Light', 'Dark', 'System'];

  const handleSelect = (item: string) => {
    setTheme(item.toLowerCase());
  };

  return (
    <DropdownMenu items={items} onSelect={handleSelect}>
      <DropdownMenuTrigger asChild={true} onClick={() => {}}>
        <Button>Toggle Theme</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="right">
        {items.map((item) => (
          <DropdownMenuItem key={item} onClick={() => handleSelect(item)}>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
