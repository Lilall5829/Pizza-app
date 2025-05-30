"use client";

import { useState } from "react";

export function PaymentConfigChecker() {
  const [showConfig, setShowConfig] = useState(false);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  const isTestMode = publishableKey.startsWith("pk_test_");
  const isDevMode = process.env.NODE_ENV === "development";
  const useRealStripe = process.env.NEXT_PUBLIC_USE_REAL_STRIPE === "true";

  if (!showConfig) {
    return (
      <button
        onClick={() => setShowConfig(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
      >
        💳 Check Payment Config
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900">Payment Configuration</h3>
        <button
          onClick={() => setShowConfig(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 text-sm">
        {/* 环境检查 */}
        <div className="flex items-center justify-between">
          <span>Environment:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isDevMode
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {process.env.NODE_ENV}
          </span>
        </div>

        {/* 支付模式检查 */}
        <div className="flex items-center justify-between">
          <span>Payment Mode:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isDevMode && !useRealStripe
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {isDevMode && !useRealStripe ? "🔧 SIMULATED" : "🚀 REAL API"}
          </span>
        </div>

        {/* Stripe密钥检查 */}
        <div className="flex items-center justify-between">
          <span>Stripe Mode:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isTestMode
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isTestMode ? "🧪 TEST" : "⚠️ LIVE"}
          </span>
        </div>

        {/* 密钥预览 */}
        <div>
          <span className="text-gray-600">Key:</span>
          <div className="mt-1 font-mono text-xs bg-gray-100 p-2 rounded">
            {publishableKey
              ? `${publishableKey.substring(0, 20)}...`
              : "Not configured"}
          </div>
        </div>

        {/* 状态说明 */}
        <div
          className={`mt-3 p-2 rounded text-xs ${
            isDevMode && !useRealStripe
              ? "bg-yellow-50 text-yellow-700"
              : isTestMode
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {isDevMode && !useRealStripe ? (
            <>
              🔧 <strong>Simulated Payment</strong>
              <br />
              No Stripe Dashboard records will appear.
              <br />
              <code className="bg-white px-1 rounded">
                NEXT_PUBLIC_USE_REAL_STRIPE=true
              </code>{" "}
              to enable real API.
            </>
          ) : isTestMode ? (
            <>
              ✅ <strong>Real Stripe Test API</strong>
              <br />
              Transactions will appear in Stripe Dashboard.
            </>
          ) : (
            <>
              ⚠️ <strong>LIVE MODE!</strong>
              <br />
              Real charges will occur!
            </>
          )}
        </div>

        {/* 测试卡信息 */}
        {isTestMode && (
          <div className="mt-3 text-xs">
            <div className="font-medium text-gray-700 mb-1">Test Cards:</div>
            <div className="space-y-1 text-gray-600">
              <div>Success: 4242 4242 4242 4242</div>
              <div>Decline: 4000 0000 0000 0002</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
