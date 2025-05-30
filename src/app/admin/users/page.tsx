"use client";

import {
  useDeleteUser,
  useUpdateUserRole,
  useUserList,
  useUserStats,
} from "@/api/users";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/providers";
import {
  Edit,
  Search,
  Shield,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UsersManagePage() {
  const { session, loading, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useUserList();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { mutate: updateUserRole, isPending: isUpdatingRole } =
    useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
    if (!loading && session && !isAdmin) {
      redirect("/");
    }
  }, [session, loading, isAdmin]);

  if (loading || usersLoading || statsLoading) {
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

  if (usersError) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Users
            </h1>
            <p className="text-gray-600">{usersError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter users based on search term and role
  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        (user.full_name &&
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.username &&
          user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.id && user.id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = roleFilter === "ALL" || user.group === roleFilter;

      return matchesSearch && matchesRole;
    }) || [];

  const handleRoleUpdate = (userId: string, role: string) => {
    if (userId === session.user.id && role !== "ADMIN") {
      toast.error("You cannot change your own admin role!");
      return;
    }

    updateUserRole(
      { userId, role },
      {
        onSuccess: () => {
          setEditingUserId(null);
          setNewRole("");
        },
      }
    );
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === session.user.id) {
      toast.error("You cannot delete your own account!");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      deleteUser(userId);
    }
  };

  const startEditing = (userId: string, currentRole: string) => {
    setEditingUserId(userId);
    setNewRole(currentRole || "CUSTOMER");
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setNewRole("");
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage user accounts, roles, and permissions
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

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Administrators
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.adminUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserCheck className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Customers
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.customerUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Orders
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalOrders}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users by name, username, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Administrators</option>
                  <option value="CUSTOMER">Customers</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500">
                No users found matching your criteria.
              </li>
            ) : (
              filteredUsers.map((user) => (
                <li key={user.id}>
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.full_name?.charAt(0)?.toUpperCase() ||
                                user.username?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-900 truncate"
                            >
                              {user.full_name ||
                                user.username ||
                                "Unknown User"}
                            </Link>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.group === "ADMIN"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.group === "ADMIN" ? "Admin" : "Customer"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500 truncate">
                              ID: {user.id}
                            </p>
                            {user.phone && (
                              <p className="text-sm text-gray-500">
                                📞 {user.phone}
                              </p>
                            )}
                            {user.default_city && (
                              <p className="text-sm text-gray-500">
                                📍 {user.default_city}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Joined:{" "}
                            {new Date(user.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {editingUserId === user.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="text-sm border border-gray-300 rounded-md px-2 py-1"
                              disabled={isUpdatingRole}
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                            <button
                              onClick={() => handleRoleUpdate(user.id, newRole)}
                              disabled={isUpdatingRole}
                              className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50"
                            >
                              {isUpdatingRole ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isUpdatingRole}
                              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(user.id, user.group)}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Edit Role"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {user.id !== session.user.id && (
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    user.id,
                                    user.full_name ||
                                      user.username ||
                                      "Unknown User"
                                  )
                                }
                                disabled={isDeletingUser}
                                className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Info Banner */}
        <div className="mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  User Management Guidelines
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      You cannot modify your own admin role or delete your own
                      account
                    </li>
                    <li>
                      Deleting a user will remove their profile but may not
                      remove their authentication account
                    </li>
                    <li>Role changes take effect immediately</li>
                    <li>Admin users have full access to the admin panel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
