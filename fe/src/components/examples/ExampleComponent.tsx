// Example usage of the auth store in any component
import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";

export function ExampleComponent() {
  const { user, isAuthenticated, updateUser } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <p>Please login to access this content</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>ID:</strong> {user?.id}
        </p>
        {user?.image && (
          <Image
            src={user.image}
            alt="Profile"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
      </div>
      <button
        onClick={() => updateUser({ name: "Updated Name" })}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Update Name
      </button>
    </div>
  );
}
