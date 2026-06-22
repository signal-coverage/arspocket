"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { MenuIcon, XIcon } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { LanguageToggle } from "./language-toggle";

export const LandingNav = () => {
  const t = useTranslations("landing.nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const NAV_LINKS = [
    { label: t("features"), href: "#features" },
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("testimonials"), href: "#testimonials" },
    { label: t("faq"), href: "#faq" },
  ];

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/85 dark:bg-[#0F1117]/85 backdrop-blur-xl border-b border-[#E8F5E9] dark:border-white/[0.06] shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -8 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Image src="/logo.png" alt="ARSPocket" width={32} height={32} className="rounded-xl" />
            </motion.div>
            <span className="font-heading font-semibold text-[#0F1117] dark:text-white text-[17px] tracking-tight">
              ARSPocket
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#5D6370] hover:text-[#0F1117] dark:text-[#8A929E] dark:hover:text-white transition-colors duration-150 relative group/nav"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#008080] group-hover/nav:w-full transition-all duration-200 rounded-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <Show when="signed-out">
              <Link href="/signin">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-[#5D6370] hover:text-[#0F1117] dark:hover:text-white"
                >
                  {t("signIn")}
                </Button>
              </Link>
              <motion.div
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
              >
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-[#0F1117] text-white hover:bg-[#0F1117]/85 dark:bg-white dark:text-[#0F1117] dark:hover:bg-white/90 rounded-lg p-4 shadow-sm"
                  >
                    {t("getStartedFree")}
                  </Button>
                </Link>
              </motion.div>
            </Show>
            <Show when="signed-in">
              <motion.div
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
              >
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="bg-[#0F1117] text-white hover:bg-[#0F1117]/85 dark:bg-white dark:text-[#0F1117] dark:hover:bg-white/90 rounded-lg p-4 shadow-sm"
                  >
                    {t("goToDashboard")}
                  </Button>
                </Link>
              </motion.div>
              <UserButton />
            </Show>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2 text-[#5D6370] hover:text-[#0F1117] dark:hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {open ? (
                  <XIcon className="w-5 h-5" />
                ) : (
                  <MenuIcon className="w-5 h-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          style={{ scaleX, transformOrigin: "left" }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A8F0B5]"
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-40 bg-white dark:bg-[#0F1117] border-b border-[#E8F5E9] dark:border-white/[0.06] md:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-[#5D6370] hover:text-[#0F1117] dark:hover:text-white transition-colors py-1 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.2 }}
                className="flex flex-col gap-2 pt-3 border-t border-[#E8F5E9] dark:border-white/[0.06]"
              >
                <div className="flex justify-end pb-1">
                  <LanguageToggle />
                </div>
                <Show when="signed-out">
                  <Link href="/signin" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full text-[#0F1117] dark:text-white">
                      {t("signIn")}
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-[#0F1117] text-white">
                      {t("getStartedFree")}
                    </Button>
                  </Link>
                </Show>
                <Show when="signed-in">
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-[#0F1117] text-white">
                      {t("goToDashboard")}
                    </Button>
                  </Link>
                  <div className="flex justify-center pt-1">
                    <UserButton />
                  </div>
                </Show>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
