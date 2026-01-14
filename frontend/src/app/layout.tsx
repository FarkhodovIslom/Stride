import type { Metadata } from "next";
import './globals.css';
import ThemeProvider from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ApiStatusProvider } from "@/components/ui/ApiStatusProvider";
import { ToastProvider } from "@/components/ui/Toast";

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
        <QueryProvider>
          <ApiStatusProvider>
            <ThemeProvider>
              <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
          </ApiStatusProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

