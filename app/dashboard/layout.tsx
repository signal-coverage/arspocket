import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARSPocket — Financial Freedom",
  description: "Track expenses, grow savings and build wealth with confidence.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider className="bg-sidebar">
      <AppSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col bg-background h-full w-full">
          <Navbar />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
