'use client';

import React from 'react';
import Image from 'next/image';

export default function Round2CompletePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/background.svg"
          alt="Background"
          fill
          className="object-cover opacity-30"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="bg-gray-900/80 rounded-lg p-8 max-w-md mx-auto border border-yellow-500">
          <h1 className="text-3xl font-bold mb-6 text-yellow-400">
            🎉 Congratulations! 🎉
          </h1>
          
          <div className="mb-8">
            <p className="text-xl font-semibold text-white mb-4">
              Round 2 Complete!
            </p>
            <p className="text-lg text-yellow-300">
              Return to Anna Audi
            </p>
          </div>
          
          <div className="text-sm text-gray-300">
            IT'S NOT OVER YET
          </div>
        </div>
      </div>
    </div>
  );
}