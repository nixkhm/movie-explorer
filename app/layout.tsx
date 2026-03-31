import { FavoritesProvider } from "./context/FavoritesContext";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Explorer",
  description:
    "Movie Explorer web app where users can search movies, view details, and save favorites with a personal rating/comment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
