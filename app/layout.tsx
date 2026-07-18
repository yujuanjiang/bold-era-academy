import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CapacitorShellClass } from "@/components/academy/capacitor-shell-class";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bold Era Academy",
  description: "Bite-size AI training for builders and teams.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f5f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  const capacitor = window.Capacitor;
  const isNative =
    location.protocol === "capacitor:" ||
    navigator.userAgent.includes("Capacitor") ||
    Boolean(capacitor?.isNativePlatform?.()) ||
    capacitor?.getPlatform?.() === "ios" ||
    capacitor?.getPlatform?.() === "android";

  if (isNative) {
    document.documentElement.classList.add("capacitor-shell");
  }
})();
            `.trim(),
          }}
        />
        <CapacitorShellClass />
        {children}
      </body>
    </html>
  );
}
