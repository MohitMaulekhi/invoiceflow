import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shared/app-shell";
import { getSession } from "@/lib/auth/session";
import { getUserProfile } from "@/server/queries/users";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceFlow",
  description: "Payment reminder system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  let userInitials = "U";
  if (session) {
    const userProfile = await getUserProfile(session.userId);
    if (userProfile?.name) {
      userInitials = userProfile.name.charAt(0).toUpperCase();
    } else if (session.email) {
      userInitials = session.email.charAt(0).toUpperCase();
    }
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-50">
        <AppShell userInitials={userInitials}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
