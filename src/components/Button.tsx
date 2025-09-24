import React, { FC } from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string; //optional to override size
  disabled?: boolean;
}

const roundBox = "/assets/round-box.svg";

const Button: FC<ButtonProps> = ({ label, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative ${className || "w-full"} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <img
        src={roundBox}
        alt={label}
        className={`w-full h-auto ${className || ""}`}
      />
       <span className={`absolute inset-0 flex items-center justify-center text-white font-bold ${
        className?.includes('text-') ? '' : 'text-xl sm:text-2xl'
      } ${className || ''}`}>
        {label}
      </span>
    </button>
  );
};

export default Button;
