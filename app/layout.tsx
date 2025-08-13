import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

export const metadata = {
  title: 'Derma-AI',
  description: 'Private skin analysis with camera and AI recommendations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
          <div className="mx-auto max-w-3xl p-6">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
