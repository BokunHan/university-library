import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

const roboto = Roboto({
  weight: ["400", "500", "700"], // The weights from your Lighthouse report
  subsets: ["latin"],
  display: "swap", // Best practice for performance
  variable: "--roboto", // Assign it to a CSS variable
});

export const metadata: Metadata = {
  title: "BookWise",
  description: "BookWise is a book borrowing library management solution.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <head>
          {/* ADDED: Preconnect to your ImageKit CDN */}
          <link
            rel="preconnect"
            href="https://ik.imagekit.io"
            crossOrigin="anonymous"
          />
        </head>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} ${roboto.variable} antialiased`}
        >
          {children}
          <Toaster position="bottom-right" />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
