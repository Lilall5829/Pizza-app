import { PaymentConfigChecker } from "@/components/PaymentConfig";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Ordering - Delicious Meals Delivered",
  description: "Order your favorite meals online with fast delivery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">{children}</div>
          <Toaster position="top-center" />
          <PaymentConfigChecker />
        </Providers>
      </body>
    </html>
  );
}
