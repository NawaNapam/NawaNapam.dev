"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";

type Props = { children: ReactNode; session?: any };

export default function Providers({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
