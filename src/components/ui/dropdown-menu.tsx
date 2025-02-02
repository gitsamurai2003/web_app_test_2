import React, { ReactNode } from 'react';

interface DropdownMenuProps {
  items: string[];
  onSelect: (item: string) => void;
  children: ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, onSelect, children }) => {
  return (
    <div>
      {children}
      <ul>
        {items.map((item, index) => (
          <li key={index} onClick={() => onSelect(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface DropdownMenuContentProps {
  children: ReactNode;
  align?: string;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, align }) => {
  return <div className={`dropdown-menu-content ${align}`}>{children}</div>;
};

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick: () => void;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick }) => {
  return (
    <div className="dropdown-menu-item" onClick={onClick}>
      {children}
    </div>
  );
};

interface DropdownMenuTriggerProps {
  children: ReactNode;
  onClick: () => void;
  asChild?: boolean;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, onClick, asChild }) => {
  return (
    <button className="dropdown-menu-trigger" onClick={onClick}>
      {children}
    </button>
  );
};

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger };