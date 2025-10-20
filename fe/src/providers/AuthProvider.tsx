"use client";

import { useSession } from "next-auth/react";
import { useAuthStore, syncAuthWithSession } from "@/stores/authStore";
import { useEffect } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // Sync session with Zustand store
    syncAuthWithSession(session);

    // Update loading state
    setLoading(status === "loading");
  }, [session, status, setLoading]);

  return <>{children}</>;
}
