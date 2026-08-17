import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "./footer";
import Navbar from "../components/Navbar";
import "../styles/global.css";
import Providers from './providers';
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SFC Cafe",
  description: "Good Food, Great Vibes",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="app-shell">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="top-right"
            reverseOrder={false}
          />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
