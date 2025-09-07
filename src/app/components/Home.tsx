"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center justify-start text-white px-4 sm:px-12 flex-1">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Home</h1>

      <div className="w-full max-w-xs mt-auto mb-4 sm:mb-6">
        <Button
          label="Go to Questions"
          onClick={() => router.push("/questions")}
          className="!w-full !py-4 sm:!py-5 !text-2xl sm:!text-3xl !font-bold"
        />
      </div>
    </div>
  );
}
