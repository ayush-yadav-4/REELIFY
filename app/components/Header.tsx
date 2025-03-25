"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaVideo, FaUser } from "react-icons/fa";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <FaVideo className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">Reelify</span>
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/upload" className="text-gray-700 hover:text-gray-900">
                  Upload
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                  <FaUser className="h-6 w-6" />
                </Link>
              </div>
            ) : (
              <Link href="/auth/signin" className="text-gray-700 hover:text-gray-900">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}