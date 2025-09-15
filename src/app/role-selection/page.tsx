'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import localFont from "next/font/local";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const rethinkSansBold = localFont({
  src: "../../../public/assets/RethinkSans-Bold.ttf", 
  variable: "--font-rethinkSansBold",
});
const rethinkSansMedium = localFont({
  src: "../../../public/assets/RethinkSans-Medium.ttf", 
  variable: "--font-rethinkSansMedium",
});

interface TeamMember {
  userId: string
  name: string
}

interface Role {
  id: string
  name: string
  image?: string
}

export default function RoleSelection() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamId, setTeamId] = useState<string>('')

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Fetch current user
  useEffect(() => {
    axios.get('/api/current-user').then(res => {
      setCurrentUserId(res.data.userId)
    }).catch(() => {
      toast.error("Failed to fetch current user")
    })
  }, [])

  // Fetch team members
  useEffect(() => {
    const teamIdParam = new URLSearchParams(window.location.search).get('teamId');
    if (teamIdParam) {
      setTeamId(teamIdParam);
      const fetchTeamMembers = async () => {
        try {
          const response = await axios.get(`/api/teams/${teamIdParam}/members`);
          if (response.data.success) {
            setTeamMembers(response.data.members);
          }
        } catch {
          const mockTeamData = {
            members: [
              { userId: 'user-id-1', name: 'idk-man' },
              { userId: 'user-id-2', name: 'James' },
              { userId: 'user-id-3', name: 'John' },
              { userId: 'user-id-4', name: 'Doe' },
              { userId: 'user-id-5', name: 'Jane' },
            ]
          };
          setTeamMembers(mockTeamData.members);
        }
      };
      fetchTeamMembers();
    } else {
      toast.error("No team ID found");
      router.push('/create-team');
    }
  }, [router]);

  const roles: Role[] = [
    { id: 'liar', name: 'liar', image: '/assets/role1.svg' },
    { id: 'role1', name: 'Role', image: '/assets/role2.svg' },
    { id: 'role2', name: 'Role', image: '/assets/role3.svg' },
    { id: 'role3', name: 'Role', image: '/assets/role4.svg' },
    { id: 'role4', name: 'Role', image: '/assets/role5.svg' }
  ]

  const handleRoleClick = (roleId: string) => {
    setSelectedRole(selectedRole === roleId ? null : roleId)
  }

  const handleAssignRole = async (userId: string, gameRole: string) => {
    if (!teamId || !currentUserId) return;
    if (userId !== currentUserId) {
      toast.error("You can only assign a role to yourself!");
      return;
    }
    try {
      setLoading(true)
      const response = await axios.post('/api/role-selection', {
        userId,
        teamId,
        gameRole
      })
      if (response.data.success) {
        toast.success('Role assigned successfully')
        setAssignments(prev => ({ ...prev, [userId]: gameRole }))
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to assign role')
    } finally {
      setLoading(false)
      setSelectedRole(null)
    }
  }

  const handleMemberClick = async (memberIndex: number) => {
    if (selectedRole && !loading) {
      const member = teamMembers[memberIndex];
      if (!member) return;
      await handleAssignRole(member.userId, selectedRole)
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable}`}>
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{backgroundImage:"url('/assets/loginbg.png')", filter: 'brightness(0.55)'}}
      />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-10">Role Selection</h1>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.slice(0, 4).map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleClick(role.id)}
                className={`bg-[#D9D9D9] rounded-lg p-4 text-center cursor-pointer
                          ${selectedRole === role.id ? 'border-2 border-yellow-400' : ''}`}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-5 bg-cover bg-center rounded"
                  style={{backgroundImage: `url('${role.image || '/assets/default-role.svg'}')`}}
                />
                <p className="text-[#200606] font-medium text-base">{role.name}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-15">
            <div
              onClick={() => handleRoleClick(roles[4].id)}
              className={`bg-gray-200/90 rounded-lg p-4 text-center cursor-pointer w-24
                        ${selectedRole === roles[4].id ? 'border-2 border-yellow-400' : ''}`}
            >
              <div 
                className="w-16 h-16 mx-auto mb-2 bg-cover bg-center rounded"
                style={{backgroundImage: `url('${roles[4].image || '/assets/default-role.svg'}')`}}
              />
              <p className="text-gray-800 font-medium text-sm">{roles[4].name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {teamMembers.slice(0, 4).map((member, index) => (
              <Button
                key={index}
                onClick={() => handleMemberClick(index)}
                disabled={loading || member.userId !== currentUserId}
                className={`h-12 bg-gray-800/90 hover:bg-gray-700/95 border border-gray-600/30 text-yellow-400 font-bold rounded-lg
                            ${member.userId !== currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {assignments[member.userId] ? roles.find(r => r.id === assignments[member.userId])?.name || member.name : member.name}
              </Button>
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <Button
              onClick={() => handleMemberClick(4)}
              disabled={loading || teamMembers[4]?.userId !== currentUserId}
              className="w-35 h-10 bg-no-repeat bg-center rounded-xl bg-cover flex items-center justify-center text-yellow-400 font-bold rounded-lg"
              style={{backgroundImage:"url('/assets/namebox.svg')"}}
            >
              {teamMembers[4] && assignments[teamMembers[4].userId]
                ? roles.find(r => r.id === assignments[teamMembers[4].userId])?.name || teamMembers[4]?.name
                : teamMembers[4]?.name}
            </Button>
          </div>

          <p className="text-white text-center font-medium text-base mt-15">
            Click a role, then click your own member to assign.
          </p>
        </div>
      </div>
    </div>
  );
}
