"use client";
import React, { useState } from 'react';

const GamePopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          Show Popup
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 "
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-md w-full">
        {/* Popup box */}
        <div 
          className="relative bg-cover bg-center bg-no-repeat p-8 min-h-[200px] flex flex-col items-center justify-center"
          style={{
            backgroundImage: 'url(/assets/Question_Box.svg)',
            
          }}
          >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute -top-8 right-5 w-8 h-8 bg-cover bg-center bg-no-repeat hover:opacity-80 transition-opacity z-10"
            style={{
              backgroundImage: 'url(/assets/X.png)'
            }}
            aria-label="Close popup"
          />

          <div className="text-center space-y-6 px-4">
            <div
  className="font-bold text-2xl leading-tight tracking-wide"
  style={{ color: "#B9B9B9" }}
>

              Wrong<br />
              answer<br />
              entered
            </div>

            

            
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default GamePopup;