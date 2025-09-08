'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [teamCode, setTeamCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Team code entered:', teamCode)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Minecraft-style pixelated background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/163036/mario-luigi-figures-funny-163036.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
          filter: 'blur(1px) brightness(0.7)',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-800/60 to-gray-900/80" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto">
          {/* Title */}
          <h1 
            className="text-4xl font-bold text-white text-center mb-12 drop-shadow-2xl"
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)' 
            }}
          >
            Join A Team
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Code Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="teamCode" 
                className="text-white/90 font-medium text-base drop-shadow-lg"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                Enter Team Code
              </Label>
              <Input
                id="teamCode"
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                className="h-14 bg-gray-200/90 backdrop-blur-sm border-gray-300/50 
                          rounded-lg text-gray-800 placeholder:text-gray-500
                          focus:bg-gray-100/95 focus:border-gray-400/70
                          shadow-lg"
                placeholder=""
                required
              />
            </div>

            {/* Don't have a team link */}
            <div className="text-center">
              <span className="text-white/80 text-sm drop-shadow-lg mr-1"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                Don't have a team?
              </span>
              <button
                type="button"
                className="text-green-400 hover:text-green-300 underline text-sm 
                          drop-shadow-lg"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                Create
              </button>
            </div>

            {/* Proceed Button */}
            <div className="pt-8">
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-purple-800/90 to-purple-900/90 
                          hover:from-purple-700/95 hover:to-purple-800/95 
                          border border-purple-600/30 text-white font-bold text-lg
                          rounded-lg shadow-2xl backdrop-blur-sm"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  PROCEED
                  <ArrowRight className="w-6 h-6" />
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}