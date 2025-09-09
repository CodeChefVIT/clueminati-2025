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


// Rethink Sans Medium
export const rethinkSansMedium = localFont({
  src: "../../public/assets/RethinkSans-Medium.ttf",
  variable: "--font-rethinkSansMedium",
});

// Rethink Sans Bold
export const rethinkSansBold = localFont({
  src: "../../public/assets/RethinkSans-Bold.ttf",
  variable: "--font-rethinkSansBold",
});