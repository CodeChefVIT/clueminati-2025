"use client";
import React, { useState } from "react";

const KeyVerification: React.FC = () => {
  const [code, setCode] = useState(Array(6).fill("")); // store 6 characters

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
    }
  };

  const handleChange = (value: string, index: number) => {
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value.toUpperCase();
      setCode(newCode);

      // Auto-focus next box
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = () => {
    console.log("Submitted code:", code.join(""));
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
      onClick={handleOverlayClick}
        style={{ backgroundImage: "url('/assets/login-bg.svg')" }}

    >
      <div className="relative max-w-md w-full z-[10000]">
        {/* Popup box with background */}
        <div
          className="relative px-8 py-20 flex flex-col items-center justify-center"
          style={{
            backgroundImage: "url(/assets/Question_Box.svg)",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >


          {/* Popup content */}
          <div className="relative text-center space-y-6 ">
            <div
              className="font-bold text-2xl leading-tight tracking-wide translate-y-[50px]"
              style={{ color: "#B9B9B9" }}
            >
              Enter the final code
            </div>
            <div
              className="font-bold text-sm leading-tight tracking-wide translate-y-[50px]"
              style={{ color: "#B9B9B975" }}
            >
              Hint: how's your indoor team doing?
            </div>

            {/* Code input boxes */}
            <div className="flex justify-center gap-1 mt translate-y-[50px] ">
              {code.map((char, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-10 h-12 text-center text-xl font-bold rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-400 focus:outline-none flex-shrink-0"
                />
              ))}
            </div>

            {/* Submit button (image) */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-32 h-12 translate-y-[100px] bg-cover bg-center bg-no-repeat hover:brightness-50 transition-opacity text-white text-lg font-semibold"
              style={{
                backgroundImage: "url(/assets/round-box.svg)",
              }}
              aria-label="Submit code"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyVerification;
