'use client'

import { useState } from "react";
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageOff } from "lucide-react";


export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempted with:', { email, password })
  }

  return (
    <div className="min-h-screen relative overflow-hidden w-full">
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{backgroundImage:"url('/assets/loginbg.png')",
          filter: 'brightness(0.55)'
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-sm mx-auto mb-21"
        >
          {/* Login Title */}
          <motion.h1 
            className="text-4xl font-bold text-white text-center mb-8 drop-shadow-2xl"
          >
            Login
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <Label 
                htmlFor="email" 
                className="text-white font-bold text-base"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-15 w-90 bg-[#D3D5D7] border-black/20 
                          rounded-lg text-gray-800 placeholder:text-gray-500
                          focus:bg-gray-100/95 focus:border-gray-400/70"
                required
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <Label 
                htmlFor="password" 
                className="text-white font-bold text-base"
                >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-15 w-90 bg-[#D3D5D7] border-black/20 
                          rounded-lg text-gray-800 placeholder:text-gray-500
                          focus:bg-gray-100/95 focus:border-gray-400/70"
                required
              />
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div
              initial={{ opacity: 1 }}
              
              className=" "
            >
              <button
                type="button"
                className="text-white text-sm px-50">
                Forget Password?
              </button>
            </motion.div>

            {/* Proceed Button */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
                
              className="pt-2"
            >
              <Button
                type="submit"
                className=""
              >
                <span className="flex items-center justify-center ">
                  PROCEED
                </span>
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}