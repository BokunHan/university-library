import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { registerLicense } from "@syncfusion/ej2-base";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";
import "@syncfusion/ej2-react-buttons/styles/material.css";
import "@syncfusion/ej2-react-popups/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";

registerLicense(process.env.NEXT_SYNCFUSION_LICENSE_KEY!);

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

export const metadata: Metadata = {
  title: "BookWise",
  description: "BookWise is a book borrowing library management solution.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
        >
          {children}
          <Toaster position="bottom-right" />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
