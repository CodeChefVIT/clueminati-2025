'use client'

import { useState } from "react";
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"


export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempted with:', { email, password })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/163036/mario-luigi-figures-funny-163036.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
          filter: 'blur(1px) brightness(0.7)',
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-800/60 to-gray-900/80" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Login Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold text-white text-center mb-8 drop-shadow-2xl"
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)' 
            }}
          >
            Login
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-2"
            >
              <Label 
                htmlFor="email" 
                className="text-white/90 font-medium text-base drop-shadow-lg"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-gray-200/90 backdrop-blur-sm border-gray-300/50 
                          rounded-lg text-gray-800 placeholder:text-gray-500
                          focus:bg-gray-100/95 focus:border-gray-400/70
                          transition-all duration-200 shadow-lg"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-2"
            >
              <Label 
                htmlFor="password" 
                className="text-white/90 font-medium text-base drop-shadow-lg"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-gray-200/90 backdrop-blur-sm border-gray-300/50 
                          rounded-lg text-gray-800 placeholder:text-gray-500
                          focus:bg-gray-100/95 focus:border-gray-400/70
                          transition-all duration-200 shadow-lg"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <button
                type="button"
                className="text-white/80 hover:text-white underline text-sm 
                          transition-colors duration-200 drop-shadow-lg"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                Forget Password?
              </button>
            </motion.div>

            {/* Proceed Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-4"
            >
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-purple-800/90 to-purple-900/90 
                          hover:from-purple-700/95 hover:to-purple-800/95 
                          border border-purple-600/30 text-white font-bold text-lg
                          rounded-lg shadow-2xl backdrop-blur-sm
                          transition-all duration-300 transform hover:scale-[1.02]
                          active:scale-[0.98] group"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <span className="flex items-center justify-center gap-3">
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