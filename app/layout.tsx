import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { LocatorSetup } from "@/components/locator-setup";
import { TooltipProvider } from "@/components/ui";
import { Bricolage_Grotesque, Onest, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-heading",
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ARSPocket — Financial Freedom",
  description: "Track expenses, grow savings and build wealth with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        bricolageGrotesque.variable,
        onest.variable,
        geistMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <LocatorSetup />
        <ClerkProvider appearance={{ cssLayerName: "clerk" }}>
          <TooltipProvider>{children}</TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
