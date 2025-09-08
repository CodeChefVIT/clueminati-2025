import localFont from "next/font/local";

export const pixelFont = localFont({
  src: [
    {
      path: "./../../public/assets/pixel-font.ttf", // relative to this file
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pixel",
});
