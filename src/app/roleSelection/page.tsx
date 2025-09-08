'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<{[key: string]: string}>({})

  const roles = [
    {
      id: 'liar',
      name: 'liar',
      image: 'https://images.pexels.com/photos/8111739/pexels-photo-8111739.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 'role1',
      name: 'Role',
      image: 'https://images.pexels.com/photos/7862492/pexels-photo-7862492.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 'role2',
      name: 'Role',
      image: 'https://images.pexels.com/photos/8111741/pexels-photo-8111741.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 'role3',
      name: 'Role',
      image: 'https://images.pexels.com/photos/7862495/pexels-photo-7862495.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 'role4',
      name: 'Role',
      image: 'https://images.pexels.com/photos/8111740/pexels-photo-8111740.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto">
          {/* Title */}
          <h1 
            className="text-4xl font-bold text-white text-center mb-8 drop-shadow-2xl"
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)' 
            }}
          >
            Role Selection
          </h1>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.slice(0, 4).map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleClick(role.id)}
                className={`bg-gray-200/90 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer
                          ${selectedRole === role.id ? 'ring-2 ring-cyan-400' : ''}
                          shadow-lg`}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-2 bg-cover bg-center rounded"
                  style={{
                    backgroundImage: `url('${role.image}')`,
                    imageRendering: 'pixelated'
                  }}
                />
                <p className="text-gray-800 font-medium text-sm">{role.name}</p>
              </div>
            ))}
          </div>

          {/* Center Role Card */}
          <div className="flex justify-center mb-8">
            <div
              onClick={() => handleRoleClick(roles[4].id)}
              className={`bg-gray-200/90 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer w-24
                        ${selectedRole === roles[4].id ? 'ring-2 ring-cyan-400' : ''}
                        shadow-lg`}
            >
              <div 
                className="w-16 h-16 mx-auto mb-2 bg-cover bg-center rounded"
                style={{
                  backgroundImage: `url('${roles[4].image}')`,
                  imageRendering: 'pixelated'
                }}
              />
              <p className="text-gray-800 font-medium text-sm">{roles[4].name}</p>
            </div>
          </div>

          {/* Team Member Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {teamMembers.slice(0, 4).map((member, index) => (
              <Button
                key={index}
                onClick={() => handleMemberClick(index)}
                className="h-12 bg-gray-800/90 hover:bg-gray-700/95 
                          border border-gray-600/30 text-yellow-400 font-bold
                          rounded-lg shadow-lg backdrop-blur-sm"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                {assignments[index] ? roles.find(r => r.id === assignments[index])?.name || member : member}
              </Button>
            ))}
          </div>

          {/* Center Member Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => handleMemberClick(4)}
              className="h-12 w-24 bg-gray-800/90 hover:bg-gray-700/95 
                        border border-gray-600/30 text-yellow-400 font-bold
                        rounded-lg shadow-lg backdrop-blur-sm"
              style={{ 
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {assignments[4] ? roles.find(r => r.id === assignments[4])?.name || teamMembers[4] : teamMembers[4]}
            </Button>
          </div>

          {/* Instructions */}
          <p 
            className="text-white/90 text-center text-sm drop-shadow-lg"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            Drag to Assign Roles
          </p>
        </div>
      </div>
    </div>
  );
}