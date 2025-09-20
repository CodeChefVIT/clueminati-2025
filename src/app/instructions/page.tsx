"use client";

import Link from "next/link";
import Image from "next/image";

export default function Instructions() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-white  h-full ">
            <div className="relative w-full bg-center bg-contain bg-no-repeat flex flex-col items-center justify-center text-white  h-[33rem] px-25"
                style={{ backgroundImage: "url('/assets/instructions_bg.svg')" }}
            >
                <h2 className="text-2xl font-bold mb-6 mt-8 text-[#A5A5A5]">Instructions</h2>

                <p className="text-center text-[#A5A5A5] text-sm sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Click on the Home button to start
                </p>
            </div>

            <Link href="/" className="relative mt-8 w-[50%] max-w-xs hover:brightness-50">
                <Image
                    src="/assets/round-box.svg"
                    alt="Proceed"
                    width={200}
                    height={80}
                    className="w-full h-auto"
                />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                    Proceed
                </span>
            </Link>
        </div>
    );
}
