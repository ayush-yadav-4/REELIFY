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
    <header className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
            onClick={() => showNotification("Welcome to ReelsPro", "info")}
          >
            <FaVideo className="text-2xl" />
            <span className="text-2xl font-bold">ReelsPro</span>
          </Link>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle text-white hover:text-yellow-200"
            >
              <FaUser className="w-5 h-5" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] shadow-lg bg-white rounded-box w-52 mt-4 py-2"
            >
              {session ? (
                <>
                  <li className="px-4 py-2 text-gray-600">
                    {session.user?.email?.split("@")[0]}
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link
                      href="/upload"
                      className="px-4 py-2 hover:bg-gray-100 block w-full text-gray-700"
                    >
                      Upload Video
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="px-4 py-2 hover:bg-gray-100 block w-full text-gray-700"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}