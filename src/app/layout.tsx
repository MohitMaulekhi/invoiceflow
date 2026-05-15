import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/shared/app-shell";
import { getSession } from "@/lib/auth/session";
import { getUserProfile } from "@/server/queries/users";

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
    <html lang="en" className="h-full antialiased">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-50 font-sans">
        <AppShell userInitials={userInitials}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
