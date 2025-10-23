import type { ReactNode } from "react";
import "./globals.css";
import LayoutClientWrapper from "@/components/LayoutWrapper";
import { Toaster } from "react-hot-toast";

export const metadata = {
	title: "Clueminati 2025",
	icons: {
		icon: "/icon-192x192.png",
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				<LayoutClientWrapper>{children}</LayoutClientWrapper>{" "}
				{/* this for keeping layout.tsx ssr  */}
			</body>
		</html>
	);
}
