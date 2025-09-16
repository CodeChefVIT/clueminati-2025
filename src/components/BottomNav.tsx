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

  const isCoreMemberPath = pathname.startsWith("/core-member");

  const tabs: Tab[] = isCoreMemberPath
    ? [
        { active: "/assets/home_active.svg", inactive: "/assets/home_inactive.svg", alt: "Home", path: "/core-member" },
        { active: "/assets/profile_active.svg", inactive: "/assets/profile_inactive.svg", alt: "Profile", path: "/core-member/profile" },
      ]
    : [
        { active: "/assets/home_active.svg", inactive: "/assets/home_inactive.svg", alt: "Home", path: "/" },
        { active: "/assets/leaderboards_active.svg", inactive: "/assets/leaderboards_inactive.svg", alt: "Leaderboard", path: "/leaderboard" },
        { active: "/assets/timer_active.svg", inactive: "/assets/timer_inactive.svg", alt: "Timer", path: "/submission-history" },
        { active: "/assets/profile_active.svg", inactive: "/assets/profile_inactive.svg", alt: "Profile", path: "/profile" },
      ];

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-evenly items-center z-20">
      {tabs.map((tab, i) => {
        let isActive = pathname === tab.path;

        if (isCoreMemberPath) {
          isActive = (tab.path === "/core-member/profile") ? (pathname === tab.path) : (pathname.startsWith("/core-member") && pathname !== "/core-member/profile");
        } else if (tab.path === "/" && (pathname === "/" || pathname.startsWith("/questions"))) {
            isActive = true;
        }

        return (
          <button
            key={i}
            onClick={() => router.push(tab.path)}
            className="flex items-center justify-center cursor-pointer"
          >
            <Image
              src={isActive ? tab.active : tab.inactive}
              alt={tab.alt}
              width={200}
              height={200}
              className="h-20 w-25"
            />
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
