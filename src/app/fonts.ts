import localFont from "next/font/local";

export const pixelFont = localFont({
  src: [
    {
      path: "./assets/fonts/Pixelify-Bold.ttf", // relative to this file
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pixel",
});
