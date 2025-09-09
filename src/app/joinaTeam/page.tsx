'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"


export default function JoinTeam() {
  const [teamCode, setTeamCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Team code entered:', teamCode)
  }

  return (
    <div className="{`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable}`}">
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{backgroundImage:"url('/assets/loginbg.png')",
          filter: 'brightness(0.55)'
        }}
      />
      
  
      <div className="relative z-10 min-h-screen flex items-center justify-center p-9">
        <div className="w-full max-w-sm mx-auto mb-25">
          <h1
            className="text-4xl font-bold text-white text-center mb-15"
            style={{ fontFamily: "var(--font-rethinkSansBold)" }}
          >
            Join A Team
          </h1>

          <form onSubmit={handleSubmit} className="space-y-2">
            
            <div className="space-y-1 text-center">
              <Label 
                htmlFor="teamCode" 
                className="text-white font-medium text-lg ml-5"
                
              >
                Enter Team Code
              </Label>
              <Input
                id="teamCode"
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                className="h-[50px] w-[91%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black flex justify-center mx-auto "
                required
              />
            </div>

     
            <div className="text-right ">
              <span className="text-white font-medium text-base mr-1">
                Don't have a team?
              </span>
              <button type="button" className="text-[#00E4B6] text-base mr-7">
                Create
              </button>
            </div>

 
            <div className="flex justify-center mt-30">
              <Button
                type="submit"
                className="w-43 h-11 bg-no-repeat bg-center rounded-xl bg-cover flex items-center justify-center "
                style={{
                  backgroundImage: "url('/assets/proceedbuttonlogin.svg')",
                }}
              ></Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}