import { Geist, Geist_Mono } from "next/font/google";
import FeedbackWidget from '../components/FeedbackWidget';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI CoFounder - Your AI-Powered Startup Journey",
  description: "Generate startup ideas, create business plans, build MVPs, and raise funding with AI assistance. Your complete startup co-founder powered by artificial intelligence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}
