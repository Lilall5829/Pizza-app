"use client";

import AddressForm from "@/components/AddressForm";
import Button from "@/components/Button";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/providers";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { session, profile, loading } = useAuth();
  const [editingAddress, setEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      redirect("/sign-in");
    }
  }, [session, loading]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSaveAddress = async (addressData: any) => {
    setSavingAddress(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: addressData.customerName,
          phone: addressData.phone,
          default_address: addressData.address,
          default_city: addressData.city,
          default_province: addressData.province,
          default_postal_code: addressData.postalCode,
          default_country: addressData.country,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session?.user.id);

      if (error) {
        throw error;
      }

      toast.success("Address saved successfully!");
      setEditingAddress(false);

      // Refresh the page to get updated profile data
      window.location.reload();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

        <div className="space-y-8">
          {/* User Information Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Account Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your account details and preferences.
              </p>
            </div>

            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {session.user.email}
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {profile?.group === "ADMIN" ? "Administrator" : "Customer"}
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Member since
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(session.user.created_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delivery Address
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Your default delivery address for orders.
                  </p>
                </div>
                {!editingAddress && (
                  <Button
                    onClick={() => setEditingAddress(true)}
                    variant="outline"
                    text={
                      profile?.default_address ? "Edit Address" : "Add Address"
                    }
                  />
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              {editingAddress ? (
                <AddressForm
                  initialData={{
                    customerName: profile?.full_name || "",
                    phone: profile?.phone || "",
                    address: profile?.default_address || "",
                    city: profile?.default_city || "",
                    province: profile?.default_province || "ON",
                    postalCode: profile?.default_postal_code || "",
                    country: profile?.default_country || "Canada",
                  }}
                  onSubmit={handleSaveAddress}
                  onCancel={() => setEditingAddress(false)}
                  submitText="Save Address"
                  loading={savingAddress}
                />
              ) : profile?.default_address ? (
                <div className="space-y-2">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {profile.full_name || "Your Name"}
                    </p>
                    {profile.phone && (
                      <p className="text-gray-600">📞 {profile.phone}</p>
                    )}
                    <p className="text-gray-600">{profile.default_address}</p>
                    <p className="text-gray-600">
                      {[
                        profile.default_city,
                        profile.default_province,
                        profile.default_postal_code,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {profile.default_country && (
                      <p className="text-gray-600">{profile.default_country}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <p className="text-gray-600">
                      No default address saved yet.
                    </p>
                    <p className="text-gray-600 text-sm">
                      Add an address to speed up future orders.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Button onClick={handleSignOut} variant="outline" text="Sign Out" />
          </div>
        </div>
      </main>
    </div>
  );
}
