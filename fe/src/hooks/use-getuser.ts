import { useSession } from "next-auth/react";
import * as React from "react";

export function useGetUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = React.useState(session?.user || null);

  React.useEffect(() => {
    if (status === "authenticated") {
      setUser(session?.user || null);
    }
  }, [session, status]);

  return user;
}
