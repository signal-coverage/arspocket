import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Bricolage_Grotesque, Onest, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";
import { LocatorSetup } from "@/components/locator-setup";
import { TooltipProvider } from "@/components/ui";
import { ThemeProvider } from "@/components/theme-provider";
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

export const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
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
        <ClerkProvider
          appearance={{ cssLayerName: "clerk" }}
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          <NextIntlClientProvider messages={messages}>
            <TooltipProvider>
              <ThemeProvider>
                {children}
                <Toaster />
              </ThemeProvider>
            </TooltipProvider>
          </NextIntlClientProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
