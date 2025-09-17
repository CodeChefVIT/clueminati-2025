'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import localFont from "next/font/local";

const rethinkSansBold = localFont({
  src: "../../../public/assets/RethinkSans-Bold.ttf", 
  variable: "--font-rethinkSansBold",
});
const rethinkSansMedium = localFont({
  src: "../../../public/assets/RethinkSans-Medium.ttf", 
  variable: "--font-rethinkSansMedium",
});

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post("/api/users/login", {
        email,
        password
      })
      toast.success("Login successful!")
      
      // Check the redirect suggestion from the API
      if (response.data.redirect) {
        router.push(response.data.redirect);
      } else if (response.data.role === "core_member") {
        router.push("/core-member")
      } else {
        // For participants, let middleware handle the routing
        router.push("/")
      }
      console.log(response)
      
      
    } catch (error: any) {
      toast.error(error.response.data.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable}`}>
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{backgroundImage:"url('/assets/loginbg.png')",
          filter: 'brightness(0.55)'
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-9">
        <div className="w-full max-w-sm mx-auto mb-23">
          <h1 
            className="text-4xl font-bold text-white text-center mb-10"
            style={{ fontFamily: 'var(--font-rethinkSansBold)' }}
          >
            Login
          </h1>

          <form onSubmit={handleSubmit} className="">
            <div className="space-y-1">
              <Label 
                htmlFor="email" 
                className="text-white font-medium text-lg"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[60px] w-[100%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black mb-3"

                required
              />
            </div>

            <div className="space-y-1">
              <Label 
                htmlFor="password" 
                className="text-white font-medium text-lg"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[60px] w-[100%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black mb-2"

                required
              />
            </div>

            { <div className="text-right">
              <button
                type="button"
                className="text-[#EAEBED] font-medium text-lg mb-1 mr-3"
              >
                Forget Password?
              </button>
            </div> }

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
  className="w-43 h-11 bg-no-repeat bg-center rounded-xl bg-cover flex items-center justify-center "
  style={{ backgroundImage: "url('/assets/proceedbuttonlogin.svg')" }}
              >
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}