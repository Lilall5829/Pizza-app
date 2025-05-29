"use client";

import { useAuth } from "@/providers";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { session, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary-600">
              🍔 Food Ordering
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Menu
            </Link>
            {session && (
              <Link
                href="/orders"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/cart"
              className="p-2 text-gray-400 hover:text-gray-600 relative"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {session ? (
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Profile</span>
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
