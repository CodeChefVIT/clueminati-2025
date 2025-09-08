"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import localFont from "next/font/local";

const rethinkSansBold = localFont({
  src: "../../../public/assets/RethinkSans-Bold.ttf",
  variable: "--font-rethinkSansBold",
});
const rethinkSansMedium = localFont({
  src: "../../../public/assets/RethinkSans-Medium.ttf",
  variable: "--font-rethinkSansMedium",
});

export default function CreateTeam() {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Team name entered:", teamName);
  };

  return (
    <div className="{`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable}`}">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "url('/assets/loginbg.png')",
          filter: "brightness(0.55)",
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-9">
        <div className="w-full max-w-sm mx-auto mb-40">
          <h1
            className="text-4xl font-bold text-white text-center mb-15"
            style={{ fontFamily: "var(--font-rethinkSansBold)" }}
          >
            Create A Team
          </h1>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2 text-center">
              <Label
                htmlFor="teamName"
                className="text-white font-bold text-lg ml-5"
              >
                Enter Team Name
              </Label>
              <Input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="h-[50px] w-[91%] bg-[#D3D5D7] border border-black/20 rounded-lg text-black flex justify-center mx-auto "
                required
              />
            </div>
            <div className="text-right ">
              <span className="text-white font-medium text-base mr-1">
                Have a team?
              </span>
              <button type="button" className="text-[#24CCFF] text-base mr-10">
                Create
              </button>
            </div>

            <div className="flex justify-center mt-22">
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
