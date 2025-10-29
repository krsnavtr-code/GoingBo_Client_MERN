import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GoingBo – Best Travel Agency in India | Flights, Hotels & Holiday Packages",
  description:
    "Book affordable flights, hotels, bus tickets, and customized holiday packages with GoingBo – India’s trusted online travel agency. Explore honeymoon tours, family vacations, and international trips at the best prices.",
  keywords: [
    "GoingBo",
    "travel agency India",
    "flight booking",
    "hotel booking",
    "holiday packages",
    "honeymoon packages",
    "bus tickets",
    "tour packages",
    "online travel portal",
    "cheap flights",
    "vacation deals"
  ],
  author: "GoingBo Travel Pvt. Ltd.",
};


// This is a server component that wraps the client LayoutWrapper
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/brand/goingbo-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-text transition-colors duration-200 min-h-screen`}>
        <AuthProvider>
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: 'var(--container-color)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
