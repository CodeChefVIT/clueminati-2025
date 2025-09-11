"use client";

export default function History() {
  const submissions = [
    { text: "Lorem ipsum dolor sit amet", time: "10:03 a.m.", score: "+4" },
    { text: "Lorem ipsum dolor sit amet", time: "10:05 a.m.", score: "+4" },
    { text: "Lorem ipsum dolor sit amet", time: "10:07 a.m.", score: "+4" },
    { text: "Lorem ipsum dolor sit amet", time: "10:09 a.m.", score: "+4" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-start text-white min-h-[calc(100vh-7rem)] p-8 sm:p-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Submission History</h1>

      <div className="mb-6">
        <div
          className="flex items-center justify-center text-lg font-bold text-[#CDCDCD] w-60 h-16 sm:w-72 sm:h-20"
          style={{
            backgroundImage: "url('/assets/score_bg.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          Your score: <span className="ml-2 text-lg text-[#CDCDCD]">200</span>
        </div>
      </div>


      <div className="w-full flex flex-col gap-2 max-w-md">
        {submissions.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-6 py-3 w-full max-w-md min-h-[100px]"
            style={{
              backgroundImage: "url('/assets/submission_bg.svg')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col">
              <span className="text-sm sm:text-base">{item.text}</span>
              <span className="text-xs opacity-80">{item.time}</span>
            </div>
            <span className="text-lg font-bold text-yellow-400">{item.score}</span>
          </div>


        ))}
      </div>
    </div>
  );
}
