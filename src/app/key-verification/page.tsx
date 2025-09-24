"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pixelFont } from "@/app/fonts"; 
import Modal from "@/components/Modal";

const KeyVerification: React.FC = () => {
  const router = useRouter();
  const [code, setCode] = useState(Array(6).fill("")); // store 6 characters
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
    }
  };

  const handleChange = (value: string, index: number) => {
    if (/^[a-zA-Z]?$/.test(value)) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const inputString = code.join("");

    // 6 char
    if (inputString.length !== 6) {
      setModalTitle("Invalid Code");
      setModalMessage("Please enter all 6 characters.");
      setShowModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/validate-string", {
        inputString: inputString,
      });

      if (response.data.success) {
        setModalTitle("Success!");
        setModalMessage("Congratulations! Round 2 complete. Redirecting...");
        setShowModal(true);

        // Redirect to round-2-complete after successful validation
        setTimeout(() => {
          router.push("/round-2-complete");
        }, 3000);
      } else {
        setModalTitle("Validation Failed");
        setModalMessage(response.data.message || response.data.error);
        setShowModal(true);
      }
    } catch (error: any) {
      let errorMessage = "An error occurred while validating the code.";

      // Check if backend provided an error message
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        // fallback for network/axios errors
        errorMessage = error.message;
      }

      setModalTitle("Error");
      setModalMessage(errorMessage);
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
      onClick={handleOverlayClick}
      style={{ backgroundImage: "url('/assets/login-bg.png')" }}
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
  className={`${pixelFont.className} font-bold text-xl leading-tight tracking-wide translate-y-[50px] mt-8`}
  style={{ color: "#B9B9B9" }}
>
  Enter the final code
</div>

            <div
              className={`${pixelFont.className} font-bold text-sm leading-tight tracking-wide translate-y-[50px]`}
  style={{ color: "#B9B9B9" }}
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
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 text-center text-xl font-bold rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-400 focus:outline-none flex-shrink-0"
                />
              ))}
            </div>

            {/* Submit button (image) */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${pixelFont.className} mt-6 w-32 h-12 translate-y-[100px] bg-cover bg-center bg-no-repeat hover:brightness-50 transition-opacity text-white text-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
style={{
  backgroundImage: "url(/assets/round-box.svg)",
}}

              aria-label="Submit code"
            >
              {isSubmitting ? "..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        backgroundSvg="/assets/round-box-hell.svg"
      >
        <h2
          className={`text-xl font-bold mb-4 ${modalTitle.includes("Success") ? "text-green-400" : "text-red-400"}`}
        >
          {modalTitle}
        </h2>
        <p className="mb-6 text-center text-white">{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default KeyVerification;
