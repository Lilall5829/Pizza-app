"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { session, isAdmin } = useAuth();
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate total items in cart
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span className="text-2xl">🍕</span>
            <span className="hidden sm:block">Pizzilla</span>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/menu"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium relative group"
            >
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </Link>
            {session && (
              <Link
                href="/orders"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium relative group"
              >
                My Orders
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <Link
                href="/profile"
                className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
            <nav className="space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/menu"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              {session && (
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              {/* Mobile User Actions */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {session ? (
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    href="/sign-in"
                    className="block mx-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
