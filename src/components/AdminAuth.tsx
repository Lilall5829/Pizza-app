"use client";

import { useAuth } from "@/providers";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface AdminAuthProps {
  children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const { session, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
    if (!loading && session && !isAdmin) {
      redirect("/");
    }
  }, [session, loading, isAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}

export default AdminAuth;
