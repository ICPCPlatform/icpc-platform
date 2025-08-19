"use client";

import { useSession as useBetterSession } from "@/lib/auth-client";

export function useSession() {
  const { data: session, isPending, error } = useBetterSession();

  return {
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      username: session.user.name || session.user.email.split('@')[0],
      role: (session.user as Record<string, unknown>).role as string || 'user',
      emailVerified: session.user.emailVerified,
      twoFactorEnabled: (session.user as Record<string, unknown>).twoFactorEnabled as boolean,
    } : null,
    session,
    isLoading: isPending,
    error,
  };
}