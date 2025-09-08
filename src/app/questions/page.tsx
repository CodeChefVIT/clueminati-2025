"use client";

import Button from "@/components/Button";



const questionBox = "/assets/Question_Box.svg";
const answerBox = "/assets/Answer_Box.svg";

export default function QuestionScreen() {
  return (
    <div className="w-full flex flex-col items-center justify-start text-white px-4 sm:px-8">
      
      {/* Question Box */}
      <div className="relative w-full max-w-2xl mb-8 sm:mb-12">
        <img src={questionBox} alt="Question Box" className="w-full" />
        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-lg sm:text-xl font-bold">
          ---The question appears here---
        </span>
      </div>

      {/* Answer Box */}
      <div className="relative w-full max-w-lg h-44 sm:h-52 mb-6 sm:mb-10">
        <img
          src={answerBox}
          alt="Answer Box"
          className="w-full h-full object-contain"
        />
        <input
          type="text"
          placeholder="Answer"
          className="absolute inset-0 bg-transparent text-center text-xl sm:text-2xl text-white font-semibold focus:outline-none px-6"
        />
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center w-full max-w-[16rem] sm:max-w-[18rem] mt-auto mb-4 sm:mb-6">
        <Button
          label="Submit"
          onClick={() => alert("Submit clicked")}
          className="!w-full !py-6 sm:!py-8 !text-3xl sm:!text-4xl !font-extrabold"
        />
      </div>

    </div>
  );
}