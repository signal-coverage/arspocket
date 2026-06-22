"use client";

import { Printer } from "lucide-react";

export const PrintButton = () => (
  <button
    onClick={() => window.print()}
    className="print-button print:hidden inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
  >
    <Printer className="size-4" />
    Print / Save as PDF
  </button>
);
