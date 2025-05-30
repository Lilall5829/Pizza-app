"use client";

import { useAuth } from "@/components/providers";
import { getBackgroundImageUrl } from "@/lib/backgroundUpload";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const [backgroundImageError, setBackgroundImageError] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      redirect("/");
    }
  }, [session, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  // 使用 Supabase Storage 背景图片，优先使用 PNG，如果不存在则使用默认图片
  const supabaseImageUrl = getBackgroundImageUrl("auth-background.png");
  const fallbackImage =
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";

  // 根据错误状态选择背景图片
  const backgroundImageUrl = backgroundImageError
    ? fallbackImage
    : supabaseImageUrl;

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 隐藏的图片用于检测加载错误 */}
      {!backgroundImageError && (
        <img
          src={supabaseImageUrl}
          alt=""
          className="hidden"
          onError={() => {
            console.log(
              "Custom background image failed to load, using fallback"
            );
            setBackgroundImageError(true);
          }}
          onLoad={() => {
            console.log("Custom background image loaded successfully");
          }}
        />
      )}

      {/* 深色覆盖层提高文字可读性 */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* 内容 */}
      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white drop-shadow-lg">
            🍔 Food Ordering
          </h2>
          <p className="mt-2 text-center text-sm text-white text-opacity-90 drop-shadow">
            Welcome back! Please sign in to your account
          </p>
          {backgroundImageError && (
            <p className="mt-1 text-center text-xs text-yellow-300 drop-shadow">
              Using default background - check admin panel
            </p>
          )}
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-white border-opacity-20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
