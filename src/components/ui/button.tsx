import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  asChild?: boolean;
  variant?: string;
  size?: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, asChild, variant, size, className, onClick }) => {
  return (
    <button className={`${className} ${size}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;