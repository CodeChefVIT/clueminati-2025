import type { ReactNode } from "react";
import "./globals.css";
import LayoutClientWrapper from "@/components/LayoutWrapper";

export const metadata = {
  title: "Clueminati 2025",
  icons: {
    icon: "/icon-192x192.png"
  },
  
}


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutClientWrapper>{children}</LayoutClientWrapper> {/* this for keeping layout.tsx ssr  */}
      </body>
    </html>
  );
}
