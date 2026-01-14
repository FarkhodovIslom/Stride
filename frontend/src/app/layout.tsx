import type { Metadata } from "next";
import './globals.css';
import SessionProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { ApiStatusProvider } from "@/components/ui/ApiStatusProvider";

export const metadata: Metadata = {
  title: "Stride - Learning Progress Dashboard",
  description: "Track your learning journey with Stride",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ApiStatusProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ApiStatusProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
