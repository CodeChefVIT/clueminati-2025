"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import Link from "next/link";
import Modal from "@/components/Modal";

const questionBox = "/assets/Question_Box.svg";

const rethinkSansBold = localFont({
  src: "../../../public/assets/RethinkSans-Bold.ttf",
  variable: "--font-rethinkSansBold",
});
const rethinkSansMedium = localFont({
  src: "../../../public/assets/RethinkSans-Medium.ttf",
  variable: "--font-rethinkSansMedium",
});

export default function SignupPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [regno, setRegno] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (fullname && regno && email) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [fullname, regno, email]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", {
        fullname,
        reg_num: regno,
        email,
      });
      console.log("Signup success", response.data);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.log("Signup failed", error);

      let message = "Signup failed. Please try again.";

      if (error.response?.data?.error) {
        try {
          const parsed = JSON.parse(error.response.data.error);

          if (Array.isArray(parsed)) {
            message = parsed.map((err: any) => err.message).join("\n");
          } else if (parsed.message) {
            message = parsed.message;
          }
        } catch (e) {
          message =
            error.response.data.message || error.response.data.error || message;
        }
      }

      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable}`}
    >
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "url('/assets/login-bg.svg')",
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-10">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-7">
            Sign Up
          </h1>

          <form onSubmit={handleSignup}>
            <div className="space-y-1">
              <Label
                htmlFor="fullname"
                className="text-white font-medium text-lg"
              >
                Full Name
              </Label>
              <Input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="h-[60px] w-[100%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black mb-2"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="regno" className="text-white font-medium text-lg">
                Registration Number
              </Label>
              <Input
                id="regno"
                type="text"
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                className="h-[60px] w-[100%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black mb-2"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-white font-medium text-lg">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[60px] w-[100%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black mb-2"
                required
              />
            </div>

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                disabled={buttonDisabled || loading}
                className={`w-43 h-11 bg-no-repeat bg-center rounded-xl bg-cover flex items-center justify-center
                  ${
                    buttonDisabled || loading
                      ? "pointer-events-none "
                      : "pointer-events-auto"
                  }
                `}
                style={{
                  backgroundImage: "url('/assets/proceedbuttonlogin.svg')",
                }}
              ></Button>
            </div>
          </form>

          <p className="text-center font-medium text-base text-white mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#24CCFF]">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => router.push("/login")}
        showCloseButton={false}
        backgroundSvg={questionBox}
      >
        <div className="text-center space-y-6 px-4 text-white">
          <h2 className="text-2xl font-bold mb-4">Account Created!</h2>
          <p className="text-white/80 mb-8">
            Please check your email for your password and login details.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-43 h-11 bg-no-repeat bg-center rounded-xl bg-cover"
            style={{
              backgroundImage: "url('/assets/proceedbuttonlogin.svg')",
            }}
            aria-label="Proceed to Login"
          />
        </div>
      </Modal>

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        backgroundSvg={questionBox}
      >
        <div className="text-center space-y-6 px-4">
          <h2 className="text-xl font-bold text-red-500">Error</h2>
          <div className="space-y-2">
            {errorMessage?.split("\n").map((line, i) => (
              <p key={i} className="text-base text-gray-300 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
