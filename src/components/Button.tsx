import React, { FC } from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string; // optional to override size
}

const roundBox = "/assets/round-box.svg";

const Button: FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`relative ${className || "w-full"}`}
    >
      <img
        src={roundBox}
        alt={label}
        className={`w-full h-auto ${className || ""}`}
      />
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
        {label}
      </span>
    </button>
  );
};

export default Button;
