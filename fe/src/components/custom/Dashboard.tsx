"use client";

import { useGetUser } from "@/hooks/use-getuser";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const user = useGetUser();

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
    }
  }, [user]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Please sign in to access the dashboard.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome,
                {" " + (session.user?.name || session.user?.email)}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> {session.user?.email}
                </p>
                <p>
                  <strong>Username:</strong>{" "}
                  {session.user?.username || "Not set"}
                </p>
                <p>
                  <strong>Name:</strong> {session.user?.name || "Not set"}
                </p>
              </div>
              <Link
                href="/profiles"
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View All Profiles
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-2">
                <p>
                  Matches: <span className="font-bold">0</span>
                </p>
                <p>
                  Messages: <span className="font-bold">0</span>
                </p>
                <p>
                  Profile Views: <span className="font-bold">0</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/profiles"
                  className="block w-full text-center bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
                >
                  Browse Profiles
                </Link>
                <Link
                  href="/chat"
                  className="block w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Start Chatting
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
