// Example client component using the validation system
"use client";

import { useState } from "react";
import { CreateUserInput, AnonymousUserInput } from "@/lib/validationSchemas";

interface CreateUserFormProps {
  onUserCreated: (user: unknown) => void;
}

export function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const [formData, setFormData] = useState<Partial<CreateUserInput>>({
    email: "",
    username: "",
    isAnonymous: false,
    preferences: {
      sessionType: "video",
      ageRange: { min: 18, max: 99 },
      genderPreference: "any",
      locationMatch: false,
      interestMatch: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/create-registered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create user");
      }

      onUserCreated(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [field]: value,
      },
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={formData.username || ""}
          onChange={(e) => handleInputChange("username", e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={formData.password || ""}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Session Type Preference
        </label>
        <select
          value={formData.preferences?.sessionType || "video"}
          onChange={(e) =>
            handlePreferenceChange("sessionType", e.target.value)
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="video">Video</option>
          <option value="text">Text</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gender Preference
        </label>
        <select
          value={formData.preferences?.genderPreference || "any"}
          onChange={(e) =>
            handlePreferenceChange("genderPreference", e.target.value)
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="any">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.preferences?.locationMatch || false}
            onChange={(e) =>
              handlePreferenceChange("locationMatch", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Match by location</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.preferences?.interestMatch ?? true}
            onChange={(e) =>
              handlePreferenceChange("interestMatch", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Match by interests</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

// Anonymous user quick join component
export function AnonymousJoinForm({ onUserCreated }: CreateUserFormProps) {
  const [formData, setFormData] = useState<Partial<AnonymousUserInput>>({
    nickname: "",
    interests: [],
    preferences: {
      sessionType: "video",
      ageRange: { min: 18, max: 99 },
      genderPreference: "any",
      locationMatch: false,
      interestMatch: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, you'd get the socketId from your Socket.IO connection
      const socketId = `socket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await fetch("/api/users/create-anonymous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          socketId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create anonymous user");
      }

      onUserCreated(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-gray-50 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800">Join Anonymously</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nickname (Optional)
        </label>
        <input
          type="text"
          value={formData.nickname || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nickname: e.target.value }))
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Enter a fun nickname"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Interests (comma-separated)
        </label>
        <input
          type="text"
          value={formData.interests?.join(", ") || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              interests: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }))
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="music, gaming, movies, art"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
      >
        {loading ? "Joining..." : "Start Chatting Anonymously"}
      </button>
    </form>
  );
}
