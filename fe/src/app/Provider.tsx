"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";
import { AuthProvider } from "@/providers/AuthProvider";

type Props = { children: ReactNode; session?: Session | null };

export default function Providers({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
