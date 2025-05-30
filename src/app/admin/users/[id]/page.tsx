"use client";

import { useUpdateUserRole, useUser } from "@/api/users";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/providers";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  ShoppingBag,
  User as UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserDetailPage() {
  const { session, loading, isAdmin } = useAuth();
  const params = useParams();
  const userId = params.id as string;
  const [editingRole, setEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUser(userId);
  const { mutate: updateUserRole, isPending: isUpdatingRole } =
    useUpdateUserRole();

  // Get user's orders (we'll simulate this by using the order API)
  // Note: In a real implementation, you'd want to create a specific hook for admin to get any user's orders

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
    if (!loading && session && !isAdmin) {
      redirect("/");
    }
  }, [session, loading, isAdmin]);

  useEffect(() => {
    if (user && !editingRole) {
      setSelectedRole(user.group || "CUSTOMER");
    }
  }, [user, editingRole]);

  if (loading || userLoading) {
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

  if (userError || !user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              User Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              {userError?.message || "The requested user could not be found."}
            </p>
            <Link
              href="/admin/users"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRoleUpdate = () => {
    if (userId === session.user.id && selectedRole !== "ADMIN") {
      toast.error("You cannot change your own admin role!");
      return;
    }

    updateUserRole(
      { userId, role: selectedRole },
      {
        onSuccess: () => {
          setEditingRole(false);
          toast.success("User role updated successfully!");
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingRole(false);
    setSelectedRole(user.group || "CUSTOMER");
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/users"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Details
                </h1>
                <p className="mt-2 text-gray-600">
                  Comprehensive user information and activity
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Basic Information
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-2xl font-medium text-gray-700">
                        {user.full_name?.charAt(0)?.toUpperCase() ||
                          user.username?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Full Name
                      </label>
                      <p className="mt-1 text-lg text-gray-900">
                        {user.full_name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Username
                      </label>
                      <p className="mt-1 text-lg text-gray-900">
                        {user.username || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        User ID
                      </label>
                      <p className="mt-1 text-sm text-gray-700 font-mono">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Contact Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="mt-1 text-gray-900">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="mt-1 text-gray-900">
                        Available via auth system
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {(user.default_address || user.default_city) && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Default Address
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="space-y-1">
                      {user.default_address && (
                        <p className="text-gray-900">{user.default_address}</p>
                      )}
                      {user.default_city && (
                        <p className="text-gray-900">
                          {[
                            user.default_city,
                            user.default_province,
                            user.default_postal_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {user.default_country && (
                        <p className="text-gray-600">{user.default_country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Account Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Member Since
                      </label>
                      <p className="mt-1 text-gray-900">
                        {user.updated_at
                          ? new Date(user.updated_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Last Updated
                      </label>
                      <p className="mt-1 text-gray-900">
                        {user.updated_at
                          ? new Date(user.updated_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Role Management */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Role Management
                  </h3>
                  {!editingRole && userId !== session.user.id && (
                    <button
                      onClick={() => setEditingRole(true)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6">
                {editingRole ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Select Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        disabled={isUpdatingRole}
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleRoleUpdate}
                        disabled={isUpdatingRole}
                        className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        <span>{isUpdatingRole ? "Saving..." : "Save"}</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdatingRole}
                        className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {user.group === "ADMIN" ? (
                        <Shield className="h-6 w-6 text-red-500" />
                      ) : (
                        <UserIcon className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {user.group === "ADMIN" ? "Administrator" : "Customer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.group === "ADMIN"
                          ? "Full access to admin panel and all features"
                          : "Standard customer access"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Quick Stats
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Total Orders
                      </label>
                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        --
                      </p>
                      <p className="text-xs text-gray-500">
                        Order history feature to be implemented
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Account Status
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Account Active
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Profile Complete
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.full_name && user.phone && user.default_address
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.full_name && user.phone && user.default_address
                        ? "Complete"
                        : "Partial"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
