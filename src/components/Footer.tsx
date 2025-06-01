"use client";

import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍕</span>
              <h3 className="text-xl font-bold text-primary-400">Pizzilla</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Authentic Italian pizzas delivered hot to your door. Fresh
              ingredients, traditional recipes, exceptional taste.
            </p>
            <div className="flex space-x-4">
              <span className="text-gray-400 cursor-default">
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-gray-400 cursor-default">
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.478 4.267C3.849 4.896 3.5 5.737 3.5 6.6v6.8c0 .863.349 1.704.978 2.333.629.629 1.47.978 2.333.978h6.8c.863 0 1.704-.349 2.333-.978.629-.629.978-1.47.978-2.333V6.6c0-.863-.349-1.704-.978-2.333C15.315 3.638 14.474 3.289 13.611 3.289h-6.8c-.863 0-1.704.349-2.333.978zM10 7.4a2.6 2.6 0 100 5.2 2.6 2.6 0 000-5.2zm0 1.3a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6zm3.25-2.75a.65.65 0 100 1.3.65.65 0 000-1.3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-gray-400 cursor-default">
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <span className="block text-gray-300 cursor-default">
                Our Menu
              </span>
              <span className="block text-gray-300 cursor-default">
                About Us
              </span>
              <span className="block text-gray-300 cursor-default">
                Track Order
              </span>
              <span className="block text-gray-300 cursor-default">
                Contact
              </span>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <nav className="space-y-2">
              <span className="block text-gray-300 cursor-default">
                Help Center
              </span>
              <span className="block text-gray-300 cursor-default">
                Privacy Policy
              </span>
              <span className="block text-gray-300 cursor-default">
                Terms of Service
              </span>
              <span className="block text-gray-300 cursor-default">
                Refund Policy
              </span>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">+1 (555) 123-PIZZA</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400" />
                <a
                  href="mailto:lilall5829@gmail.com"
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  lilall5829@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">
                  123 Pizza Street, Flavor City
                </span>
              </div>
            </div>

            {/* Technical Support */}
            <div className="mt-6 p-3 bg-gray-800 rounded-lg">
              <h5 className="text-sm font-medium text-primary-400 mb-2">
                Technical Support
              </h5>
              <a
                href="mailto:lilall5829@gmail.com"
                className="text-sm text-gray-300 hover:text-primary-400 transition-colors"
              >
                lilall5829@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              <p>&copy; {currentYear} Pizzilla. All rights reserved.</p>
            </div>
            <div className="text-gray-400 text-sm mt-2 md:mt-0">
              <p>Made with ❤️ for pizza lovers everywhere</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
