"use client";
import React from "react";

interface GamePopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const GamePopup: React.FC<GamePopupProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[9999]"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-md w-full z-[10000]">
        {/* Popup box */}
        <div
          className="relative bg-cover bg-center bg-no-repeat p-8 min-h-[200px] flex flex-col items-center justify-center"
          style={{
            backgroundImage: "url(/assets/Question_Box.svg)",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute -top-8 right-5 w-8 h-8 bg-cover bg-center bg-no-repeat hover:opacity-80 transition-opacity"
            style={{
              backgroundImage: "url(/assets/X.svg)",
            }}
            aria-label="Close popup"
          />

          <div className="text-center space-y-6 px-4">
            <div
              className="font-bold text-2xl leading-tight tracking-wide"
              style={{ color: "#B9B9B9" }}
            >
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePopup;
