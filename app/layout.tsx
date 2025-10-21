// app/layout.tsx (server component)
import { Poppins } from "next/font/google";
import React from "react";
import "../styles/globals.css";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  fallback: ["sans-serif"],
});

export const metadata = {
  title: "Jungle Journey",
  description: "lorem ipsum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-gray-200 flex items-center justify-center min-h-screen">
        <div className="w-[390px] h-[844px] bg-background border-4 border-text-primary rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
