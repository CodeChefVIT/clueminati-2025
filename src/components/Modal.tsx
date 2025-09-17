"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundSvg?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  backgroundSvg,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm z-[9999]"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-md w-full z-[10000]">
        <div
          className="relative bg-cover bg-center bg-no-repeat p-8 min-h-[200px] flex flex-col items-center justify-center"
          style={{
            backgroundImage: backgroundSvg ? `url(${backgroundSvg})` : "none",
            backgroundColor: !backgroundSvg ? "#1C1C1C" : "transparent",
            border: !backgroundSvg ? "1px solid #4A4A4A" : "none",
            borderRadius: !backgroundSvg ? "1rem" : "0",
          }}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute -top-8 right-5 w-8 h-8 bg-cover bg-center bg-no-repeat hover:opacity-80 transition-opacity"
              style={{ backgroundImage: "url(/assets/X.svg)" }}
              aria-label="Close popup"
            />
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;