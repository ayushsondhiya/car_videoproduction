import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Drive Out | Automotive Video Production by Apisomi",
  description: "Drive Out by Apisomi - High-impact consumer video production, car delivery reels, and automotive visual media.",
  icons: {
    icon: "/drive_out_logo.png",
    shortcut: "/drive_out_logo.png",
    apple: "/drive_out_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
