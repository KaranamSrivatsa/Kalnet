"use client";

import { useState } from "react";

interface AIProviderToggleProps {
  useGroq: boolean;
  onToggle: (useGroq: boolean) => void;
}

export function AIProviderToggle({ useGroq, onToggle }: AIProviderToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
      <span className={`text-sm font-medium transition-colors ${useGroq ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
        🚀 Groq (Fast)
      </span>
      
      <button
        onClick={() => onToggle(!useGroq)}
        className={`relative w-16 h-8 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          useGroq 
            ? 'bg-blue-500 focus:ring-blue-500' 
            : 'bg-purple-500 focus:ring-purple-500'
        }`}
        aria-label={`Switch to ${useGroq ? 'Gemini' : 'Groq'} AI`}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out flex items-center justify-center text-xs ${
            useGroq 
              ? 'left-1 transform translate-x-0' 
              : 'right-1 transform -translate-x-0'
          }`}
        >
          {useGroq ? '🚀' : '💎'}
        </div>
      </button>
      
      <span className={`text-sm font-medium transition-colors ${!useGroq ? 'text-purple-600 font-bold' : 'text-gray-500'}`}>
        💎 Gemini (Detailed)
      </span>
    </div>
  );
}
