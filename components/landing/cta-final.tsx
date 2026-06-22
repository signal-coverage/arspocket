"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, MailIcon } from "lucide-react";
import { Show } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const FinalCta = () => {
  const t = useTranslations("landing.ctaFinal");

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #A8F0B5 0%, #6DDC8C 40%, #008080 100%)",
        }}
      />
      {/* Slow-drifting ambient orbs */}
      <motion.div
        className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #0D3B26 0%, transparent 70%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[10%] w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #005F5F 0%, transparent 70%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-[800px] mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-[#0D3B26]/60 uppercase tracking-[0.12em] font-medium mb-4"
        >
          {t("sectionLabel")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-heading text-4xl sm:text-5xl font-bold text-[#0D3B26] tracking-tight leading-[1.05] mb-5"
        >
          {t("headline")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="text-[#0D3B26]/70 text-lg max-w-md mx-auto mb-8"
        >
          {t("subheadline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.18 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Show when="signed-out">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              {/* Pulse ring */}
              <motion.span
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ border: "2px solid rgba(13,59,38,0.4)" }}
                animate={{ scale: [1, 1.22], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#0D3B26] text-white hover:bg-[#0D3B26]/85 rounded-xl px-7 h-12 text-sm font-medium gap-2 shadow-lg"
                >
                  {t("getStartedFree")}
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </Show>

          <Show when="signed-in">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              <motion.span
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ border: "2px solid rgba(13,59,38,0.4)" }}
                animate={{ scale: [1, 1.22], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#0D3B26] text-white hover:bg-[#0D3B26]/85 rounded-xl px-7 h-12 text-sm font-medium gap-2 shadow-lg"
                >
                  {t("goToDashboard")}
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </Show>

          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-[#0D3B26]/25 text-[#0D3B26] hover:bg-[#0D3B26]/8 rounded-xl px-7 h-12 text-sm font-medium gap-2 bg-transparent"
            >
              <MailIcon className="w-4 h-4" />
              {t("contactSales")}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
