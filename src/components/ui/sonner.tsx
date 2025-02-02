import React from 'react';

interface ToasterProps {
  message: string;
  richColors?: boolean;
}

export const Toaster: React.FC<ToasterProps> = ({ message, richColors }) => {
  return (
    <div className={`toaster ${richColors ? 'rich-colors' : ''}`}>
      {message}
    </div>
  );
};