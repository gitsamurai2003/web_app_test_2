import React, { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;