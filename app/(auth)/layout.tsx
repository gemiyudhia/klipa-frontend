import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='md:flex items-center justify-center min-h-screen border-none'>
      <div>{children}</div>
    </main>
  );
}
