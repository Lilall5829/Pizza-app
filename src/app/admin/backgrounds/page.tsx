"use client";

import { Header } from "@/components/Header";
import { useAuth } from "@/components/providers";
import {
  getBackgroundImageUrl,
  listBackgroundImages,
  uploadBackgroundImage,
} from "@/lib/backgroundUpload";
import { Eye, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface BackgroundFile {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    size: number;
  };
}

export default function BackgroundManagePage() {
  const { session, loading, isAdmin } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [backgrounds, setBackgrounds] = useState<BackgroundFile[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
    if (!loading && session && !isAdmin) {
      redirect("/");
    }
  }, [session, loading, isAdmin]);

  useEffect(() => {
    if (session && isAdmin) {
      loadBackgrounds();
    }
  }, [session, isAdmin]);

  const loadBackgrounds = async () => {
    try {
      const files = await listBackgroundImages();
      setBackgrounds(files);
    } catch (error) {
      console.error("Error loading backgrounds:", error);
      toast.error("Failed to load background images");
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const result = await uploadBackgroundImage(file);

      if (result.success) {
        toast.success("Background image uploaded successfully!");
        await loadBackgrounds(); // Refresh the list

        // Clear the input
        event.target.value = "";
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const previewImage = (fileName: string) => {
    const url = getBackgroundImageUrl(fileName);
    window.open(url, "_blank");
  };

  if (loading || loadingList) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Background Images
              </h1>
              <p className="mt-2 text-gray-600">
                Manage login page background images
              </p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Upload New Background
            </h3>
          </div>
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="background-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload background image
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    JPEG, PNG or WebP up to 5MB
                  </span>
                </label>
                <input
                  id="background-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
              {uploading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Background Images */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Current Background Images
            </h3>
          </div>
          <div className="p-6">
            {backgrounds.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No background images uploaded yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="aspect-video bg-gray-100 rounded-md mb-3 overflow-hidden">
                      <img
                        src={getBackgroundImageUrl(bg.name)}
                        alt={bg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {bg.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Size: {formatFileSize(bg.metadata?.size)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(bg.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewImage(bg.name)}
                          className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  How to use your background images
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      Upload your preferred background image using the form
                      above
                    </li>
                    <li>Copy the image URL from the preview</li>
                    <li>
                      Update the layout file to use your custom background
                    </li>
                    <li>
                      The image will be served from Supabase CDN for optimal
                      performance
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
