import { Geist, Geist_Mono, Amatic_SC } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const amatic = Amatic_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-amatic",
});
