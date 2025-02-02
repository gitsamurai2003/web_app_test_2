import React, { ReactNode } from 'react';

interface SidebarLinkGroupProps {
  children: ReactNode;
}

const SidebarLinkGroup: React.FC<SidebarLinkGroupProps> = ({ children }) => {
  return (
    <div className="sidebar-link-group">
      {children}
    </div>
  );
};

export default SidebarLinkGroup;