"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        {session?.user?.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full"
          />
        )}
        <span className="text-sm text-gray-700">{session?.user?.name}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
