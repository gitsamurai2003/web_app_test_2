"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultLinks, additionalLinks } from "@/config/nav";
import React from 'react';
import SidebarLinkGroup from '@/components/SidebarLinkGroup'; // Asegúrate de que la ruta es correcta

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarItemsProps {
  fullPathname: string | null;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ fullPathname }) => {
  const safeFullPathname = fullPathname ?? 'default/path';

  return (
    <div>
      <SidebarLinkGroup>
        <p>Full Pathname: {safeFullPathname}</p>
        {/* Otras partes del componente */}
      </SidebarLinkGroup>
    </div>
  );
};

export default SidebarItems;
