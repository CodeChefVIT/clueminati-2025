'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"
import localFont from "next/font/local";

const rethinkSansBold = localFont({
  src: "../../../public/assets/RethinkSans-Bold.ttf", 
  variable: "--font-rethinkSansBold",
});
const rethinkSansMedium = localFont({
  src: "../../../public/assets/RethinkSans-Medium.ttf", 
  variable: "--font-rethinkSansMedium",
});

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<{[key: string]: string}>({})

  const roles = [
    {
      id: 'liar',
      name: 'liar',
      image: '/assets/role1.svg'
      },
    {
      id: 'role1',
      name: 'Role',
      },
    {
      id: 'role2',
      name: 'Role',
      image: ''
    },
    {
      id: 'role3',
      name: 'Role',
      image: ''
    },
    {
      id: 'role4',
      name: 'Role',
      image: ''
    }
  ]

  const teamMembers = ['Name', 'Name', 'Name', 'Name', 'Name']

  const handleRoleClick = (roleId: string) => {
    setSelectedRole(selectedRole === roleId ? null : roleId)
  }

  const handleMemberClick = (memberIndex: number) => {
    if (selectedRole) {
      setAssignments(prev => ({
        ...prev,
        [memberIndex]: selectedRole
      }))
      setSelectedRole(null)
    }
  }

  return (
    <div className="{`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable}`}">
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{backgroundImage:"url('/assets/loginbg.png')",
          filter: 'brightness(0.55)'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto">
         
          <h1 
            className="text-4xl font-bold text-white text-center mb-10 "
        
          >
            Role Selection
          </h1>

       
          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.slice(0, 4).map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleClick(role.id)}
                className={`bg-[#D9D9D9]  rounded-lg p-4 text-center cursor-pointer
                          ${selectedRole === role.id ? '' : ''}
                          `}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-5 bg-cover bg-center rounded"
                  style={{
                    backgroundImage: `url('${role.image}')`,
                  }}
                />
                <p className="text-[#200606] font-medium text-base">{role.name}</p>
              </div>
            ))}
          </div>

       
          <div className="flex justify-center mb-15">
            <div
              onClick={() => handleRoleClick(roles[4].id)}
              className={`bg-gray-200/90  rounded-lg p-4 text-center cursor-pointer w-24
                        ${selectedRole === roles[4].id ? '' : ''}
                        `}
            >
              <div 
                className="w-16 h-16 mx-auto mb-2 bg-cover bg-center rounded"
                style={{
                  backgroundImage: `url('${roles[4].image}')`,
                  
                }}
              />
              <p className="text-gray-800 font-medium text-sm">{roles[4].name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {teamMembers.slice(0, 4).map((member, index) => (
              <Button
                key={index}
                onClick={() => handleMemberClick(index)}
                className="h-12 bg-gray-800/90 hover:bg-gray-700/95 
                          border border-gray-600/30 text-yellow-400 font-bold
                          rounded-lg "
                
              >
                {assignments[index] ? roles.find(r => r.id === assignments[index])?.name || member : member}
              </Button>
            ))}
          </div>

      
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => handleMemberClick(4)}
              className="h-12 w-24 bg-gray-800/90 hover:bg-gray-700/95 
                        border border-gray-600/30 text-yellow-400 font-bold
                        rounded-lg "
              
            >
              {assignments[4] ? roles.find(r => r.id === assignments[4])?.name || teamMembers[4] : teamMembers[4]}
            </Button>
          </div>


          <p 
            className="text-white/90 text-center text-sm "
            >
            Drag to Assign Roles
          </p>
        </div>
      </div>
    </div>
  );
}