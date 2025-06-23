import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
// import { ThemeProvider } from "next-themes";
// import StoreProvider from "./lib/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "s3-file-manager",
  description: "S3 File Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <StoreProvider> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem
          disableTransitionOnChange storageKey="s3-file-manager-theme">
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
      {/* </StoreProvider> */}
    </html>
  );
}
