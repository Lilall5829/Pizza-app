"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { session, isAdmin } = useAuth();
  const { items } = useCart();

  // Calculate total items in cart
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary-600"
          >
            🍕 Pizzilla
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
            {/* Search */}
            <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <Link
                href="/profile"
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
