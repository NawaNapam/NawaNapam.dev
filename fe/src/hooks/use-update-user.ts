import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  image?: string;
}

interface UpdateUserResponse {
  message: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    image: string | null;
    isAnonymous: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { update } = useSession();

  const updateUser = async (
    data: UpdateUserData
  ): Promise<UpdateUserResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/updateuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || "Failed to update user";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }

      // Update the session with new user data
      await update({
        name: result.user.name,
        username: result.user.username,
        email: result.user.email,
        image: result.user.image,
      });

      toast.success(result.message);
      return result;
    } catch (err) {
      console.error("Update user error:", err);
      const errorMessage = "An error occurred while updating user";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser,
    isLoading,
    error,
  };
}
