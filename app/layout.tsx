import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./visual.css";
import "./development.css";
import "./care.css";
import "./memory.css";
import "./library.css";
import "./sleep-sounds.css";
import "./reports.css";
import "./family.css";
import "./notifications.css";
import "./auth.css";

export const metadata: Metadata = {
  title: "Pilu | Your baby's AI companion",
  description: "Pilu helps parents through every little moment.",
  applicationName: "Pilu",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }, { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/icons/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  other: { "apple-mobile-web-app-capable": "yes", "apple-mobile-web-app-status-bar-style": "default", "apple-touch-startup-image": "/branding/pilu-splash.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0F3473",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
