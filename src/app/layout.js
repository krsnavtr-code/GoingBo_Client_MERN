import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Portfolio | Web Developer",
  description: "Welcome to my personal portfolio showcasing my projects and skills as a web developer",
  keywords: ["portfolio", "web development", "developer", "projects"],
  author: "Krishna Avtar",
};

// This is a server component that wraps the client LayoutWrapper
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="../../public/assets/trivixa-mini-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-text transition-colors duration-200 min-h-screen`}
      >
        <AuthProvider>
          <ThemeProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
