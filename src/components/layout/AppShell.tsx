"use client";

import { Sidebar, MobileNav, TopBar } from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            {children}
          </main>
        </div>
      </div>
      <MobileNav />
    </ThemeProvider>
  );
}
