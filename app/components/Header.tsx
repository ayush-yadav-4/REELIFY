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
    <header className="bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <FaVideo className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">Reelify</span>
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/upload" 
                  className="text-white hover:text-yellow-200 transition-colors duration-200 font-medium"
                >
                  Upload
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-white hover:text-yellow-200 transition-colors duration-200 font-medium"
                >
                  Sign Out
                </button>
                <Link 
                  href="/profile" 
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                >
                  <FaUser className="h-5 w-5 text-white" />
                </Link>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-white hover:text-yellow-200 transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}