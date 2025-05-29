"use client";

import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully signed in!");
    }

    setLoading(false);
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Sign In
      </h3>

      <form onSubmit={signInWithEmail} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jon@gmail.com"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          text={loading ? "Signing in..." : "Sign in"}
        />
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/sign-up"
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
