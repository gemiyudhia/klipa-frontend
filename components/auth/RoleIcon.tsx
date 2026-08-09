import * as React from 'react';

interface RoleIconProps {
  children: React.ReactNode;
}

export default function RoleIcon({ children }: RoleIconProps) {
  return (
    <div aria-hidden="true" className="text-5xl">
      {children}
    </div>
  );
}
