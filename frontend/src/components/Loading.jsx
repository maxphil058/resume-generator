import React from "react"

export default function Loading({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600`}></div>
      {text && (
        <p className="mt-4 text-gray-600 font-medium">{text}</p>
      )}
    </div>
  )
}

// Alternative loading component with dots animation
export function LoadingDots({ text = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 font-medium">{text}</p>
      )}
    </div>
  )
}

// Full screen loading overlay
export function LoadingOverlay({ isVisible = false, text = "Loading..." }) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <Loading size="lg" text={text} />
      </div>
    </div>
  )
} 