'use client';

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import React from 'react';
import Camera from './camera';

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Derma-AI</h1>
        <div>
          {isSignedIn ? (
            <SignOutButton>
              <button className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
                Sign out
              </button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
                Sign in
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      {!isSignedIn ? (
        <main className="mt-10 text-center">
          <p className="mb-6 text-lg">Sign in to start your private skin scan.</p>
          <SignInButton mode="modal">
            <button className="rounded-md bg-blue-600 px-5 py-2.5 text-white shadow hover:bg-blue-500">
              Continue
            </button>
          </SignInButton>
        </main>
      ) : (
        <main>
          <p className="mb-4 text-gray-600">Welcome{user?.firstName ? `, ${user.firstName}` : ''}! Start your scan below.</p>
          <Camera />
        </main>
      )}
    </div>
  );
}
