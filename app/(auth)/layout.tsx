import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='md:flex items-center justify-center min-h-screen px-4 py-8'>
      <div className='w-full max-w-3xl'>{children}</div>
    </main>
  );
}
