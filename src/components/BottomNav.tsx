"use client";

import { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface Tab {
  active: string;
  inactive: string;
  alt: string;
  path: string;
}

const BottomNav: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: Tab[] = [
    { active: "/assets/home_active.png", inactive: "/assets/home_inactive.png", alt: "Home", path: "/" },
    { active: "/assets/leaderboards_active.png", inactive: "/assets/leaderboards_inactive.png", alt: "Leaderboards", path: "/leaderboards" },
    { active: "/assets/timer_active.png", inactive: "/assets/timer_inactive.png", alt: "Timer", path: "/submission-history" },
    { active: "/assets/profile_active.png", inactive: "/assets/profile_inactive.png", alt: "Profile", path: "/profile" },
  ];

  const currentTab = tabs.findIndex(tab => tab.path === pathname);

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-evenly items-center  z-20">
      {tabs.map((tab, i) => {
        const isActive = i === currentTab;
        return (
          <button
            key={i}
            onClick={() => router.push(tab.path)}
            className="flex items-center justify-center  cursor-pointer"
          >
            <Image
              src={isActive ? tab.active : tab.inactive}
              alt={tab.alt}
              width={200}
              height={200}
              // className="object-contain"
            />
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
