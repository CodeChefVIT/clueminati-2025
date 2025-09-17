'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import localFont from "next/font/local";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const rethinkSansBold = localFont({
  src: "../../../public/assets/RethinkSans-Bold.ttf", 
  variable: "--font-rethinkSansBold",
});
const rethinkSansMedium = localFont({
  src: "../../../public/assets/RethinkSans-Medium.ttf", 
  variable: "--font-rethinkSansMedium",
});

interface TeamMember {
  _id: string
  fullname: string
  region?: 'hell' | 'earth'
}

export default function RegionSelection() {
  const router = useRouter()
  const [selectedRegion, setSelectedRegion] = useState<'hell' | 'earth' | null>(null)
  const [loading, setLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null)
  const [hellCount, setHellCount] = useState(0)
  const [earthCount, setEarthCount] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [isConfirmActive, setIsConfirmActive] = useState(false)

  //countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showConfirm && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsConfirmActive(true);
    }
    return () => clearTimeout(timer);
  }, [showConfirm, countdown]);

  //fetch current user and team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.post('/api/users/profile');
        const userData = profileResponse.data.data.user;
        const teamData = profileResponse.data.data.team;
        
        setCurrentUser(userData);

        if (teamData?.teamId) {
          try {
            const membersResponse = await axios.get(`/api/teams/${teamData.teamId}/members`);
            if (membersResponse.data.success) {
              setTeamMembers(membersResponse.data.members);
              //count current hell and earth members
              const hellMembers = membersResponse.data.members.filter((m: TeamMember) => m.region === 'hell');
              const earthMembers = membersResponse.data.members.filter((m: TeamMember) => m.region === 'earth');
              setHellCount(hellMembers.length);
              setEarthCount(earthMembers.length);
            }
          } catch (error) {
            console.log('Could not fetch team members, using current user only');
            setTeamMembers([userData]);
          }
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load user data");
      }
    };
    fetchData();
  }, []);

  const handleRegionSelect = async (region: 'hell' | 'earth') => {
    if (!currentUser) {
      toast.error("User data not loaded");
      return;
    }

    //check if hell or earth is full excluding current user if they already have that region
    const currentUserHasHell = currentUser.region === 'hell';
    const currentUserHasEarth = currentUser.region === 'earth';
    const effectiveHellCount = currentUserHasHell ? hellCount - 1 : hellCount;
    const effectiveEarthCount = currentUserHasEarth ? earthCount - 1 : earthCount;
    
    if (region === 'hell' && effectiveHellCount >= 2) {
      toast.error("Hell region is full! Maximum 2 members allowed.");
      return;
    }

    if (region === 'earth' && effectiveEarthCount >= 3) {
      toast.error("Earth region is full! Maximum 3 members allowed.");
      return;
    }

    //set selected region and show confirm button
    setSelectedRegion(region);
    setShowConfirm(true);
    setCountdown(10);
    setIsConfirmActive(false);
  };

  const handleConfirm = async () => {
    if (!selectedRegion || !isConfirmActive) return;

    try {
      setLoading(true);
      console.log('Attempting to confirm region:', selectedRegion);
      
      const response = await axios.post('/api/region-selection', {
        region: selectedRegion
      });

      console.log('API Response:', response.data);

      //check for success response
      if (response.data.success || response.data.message) {
        toast.success(`Region confirmed: ${selectedRegion.toUpperCase()}`);
        //update current user state
        setCurrentUser(prev => prev ? {...prev, region: selectedRegion} : null);
        
        //update hell and earth count
        if (selectedRegion === 'hell' && currentUser && currentUser.region !== 'hell') {
          setHellCount(prev => prev + 1);
        } else if (selectedRegion === 'earth' && currentUser && currentUser.region !== 'earth') {
          setEarthCount(prev => prev + 1);
        }
        
        //decrease count if switching from a region
        if (currentUser && currentUser.region === 'hell' && selectedRegion !== 'hell') {
          setHellCount(prev => prev - 1);
        } else if (currentUser && currentUser.region === 'earth' && selectedRegion !== 'earth') {
          setEarthCount(prev => prev - 1);
        }
        
        //immediate redirect to profile
        console.log('Redirecting to profile...');
        
        //add a small delay to ensure the token is updated on the server side
        setTimeout(async () => {
          try {
            await router.push('/profile');
          } catch (routerError) {
            console.log('Router failed, using window.location');
            window.location.href = '/profile';
          }
        }, 500);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error: any) {
      console.error('Region confirmation error:', error);
      toast.error(error.response?.data?.error || 'Failed to assign region');
      //reset confirm state on error
      setShowConfirm(false);
      setSelectedRegion(null);
    } finally {
      setLoading(false);
    }
  };

  const isHellDisabled = () => {
    if (!currentUser) return true;
    const currentUserHasHell = currentUser.region === 'hell';
    const effectiveHellCount = currentUserHasHell ? hellCount - 1 : hellCount;
    return effectiveHellCount >= 2;
  };

  const isEarthDisabled = () => {
    if (!currentUser) return true;
    const currentUserHasEarth = currentUser.region === 'earth';
    const effectiveEarthCount = currentUserHasEarth ? earthCount - 1 : earthCount;
    return effectiveEarthCount >= 3;
  };

  return (
    <div className={`min-h-screen relative overflow-hidden w-full ${rethinkSansBold.variable} ${rethinkSansMedium.variable}`}>
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{backgroundImage:"url('/assets/loginbg.png')", filter: 'brightness(0.55)'}}
      />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Region Selection</h1>
          <p className="text-white text-center mb-10 text-lg">Choose your region to play in</p>

          {/* Current User Info */}
          {currentUser && (
            <div className="text-center mb-8">
              <p className="text-white text-xl mb-2">Welcome, {currentUser.fullname}!</p>
              {currentUser.region && (
                <p className="text-yellow-400 text-lg">Current Region: {currentUser.region.toUpperCase()}</p>
              )}
            </div>
          )}

          {/* Region Selection */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            
            {/* Hell Region */}
            <div className="flex flex-col items-center">
              <Button
                onClick={() => handleRegionSelect('hell')}
                disabled={loading || isHellDisabled()}
                className={`w-full h-32 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 
                          border-2 border-red-400 text-white font-bold text-2xl rounded-xl shadow-lg
                          ${selectedRegion === 'hell' ? 'ring-4 ring-yellow-400' : ''}
                          ${isHellDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'}`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">🔥</span>
                  <span>HELL</span>
                  <span className="text-sm mt-1">({hellCount}/2 slots filled)</span>
                </div>
              </Button>
              {isHellDisabled() && (
                <p className="text-red-400 text-sm mt-2">Hell region is full</p>
              )}
            </div>

            {/* Earth Region */}
            <div className="flex flex-col items-center">
              <Button
                onClick={() => handleRegionSelect('earth')}
                disabled={loading || isEarthDisabled()}
                className={`w-full h-32 bg-gradient-to-br from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 
                          border-2 border-green-400 text-white font-bold text-2xl rounded-xl shadow-lg
                          ${selectedRegion === 'earth' ? 'ring-4 ring-yellow-400' : ''}
                          ${isEarthDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'}`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">🌍</span>
                  <span>EARTH</span>
                  <span className="text-sm mt-1">({earthCount}/3 slots filled)</span>
                </div>
              </Button>
              {isEarthDisabled() && (
                <p className="text-green-400 text-sm mt-2">Earth region is full</p>
              )}
            </div>
          </div>

          {/* Confirm Button with Timer */}
          {showConfirm && (
            <div className="flex flex-col items-center mb-8">
              <div className="bg-black/40 rounded-lg p-6 w-full max-w-sm">
                <h3 className="text-white text-xl font-bold text-center mb-4">
                  Confirm Region Selection
                </h3>
                <p className="text-white text-center mb-4">
                  You selected: <span className={`font-bold ${selectedRegion === 'hell' ? 'text-red-400' : 'text-green-400'}`}>
                    {selectedRegion?.toUpperCase()}
                  </span>
                </p>
                
                {countdown > 0 ? (
                  <div className="text-center mb-4">
                    <p className="text-gray-300 text-sm mb-2">Please wait to confirm</p>
                    <div className="text-4xl font-bold text-yellow-400">
                      {countdown}
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-4">
                    <p className="text-green-400 text-sm">Ready to confirm!</p>
                  </div>
                )}

                <Button
                  onClick={handleConfirm}
                  disabled={!isConfirmActive || loading}
                  className={`w-full h-14 text-xl font-bold rounded-xl transition-all duration-300 ${
                    isConfirmActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:scale-105' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {loading ? 'Confirming...' : isConfirmActive ? 'CONFIRM SELECTION' : 'PLEASE WAIT...'}
                </Button>
                
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedRegion(null);
                    setCountdown(10);
                    setIsConfirmActive(false);
                  }}
                  className="w-full mt-3 text-gray-400 hover:text-white text-sm underline"
                >
                  Cancel and choose again
                </button>
              </div>
            </div>
          )}

          {/* Team Members Status */}
          {teamMembers.length > 0 && (
            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <h3 className="text-white text-lg font-bold mb-3">Team Status:</h3>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member._id} className="flex justify-between text-white">
                    <span className={member._id === currentUser?._id ? 'font-bold text-yellow-400' : ''}>
                      {member.fullname} {member._id === currentUser?._id ? '(You)' : ''}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      member.region === 'hell' ? 'bg-red-600' : 
                      member.region === 'earth' ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {member.region ? member.region.toUpperCase() : 'Not Selected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-white text-center font-medium text-base">
            Choose wisely! Hell region: max 2 members, Earth region: max 3 members per team.
          </p>
        </div>
      </div>
    </div>
  );
}
