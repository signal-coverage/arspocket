"use client";

import { motion } from "framer-motion";
import {
  TrendingUpIcon,
  WalletIcon,
  TargetIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ICONS = [TrendingUpIcon, WalletIcon, TargetIcon];

export const FeaturesSection = () => {
  const t = useTranslations("landing.features");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section id="features" className="py-24 bg-white dark:bg-[#0F1117]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs text-[#008080] uppercase tracking-[0.12em] font-medium mb-3"
          >
            {t("sectionLabel")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-heading text-3xl sm:text-4xl font-bold text-[#0F1117] dark:text-white tracking-tight"
          >
            {t("headline")}
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((feature, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group bg-white dark:bg-[#1A1A25] border border-[#E8F5E9] dark:border-white/[0.06] rounded-2xl p-7 cursor-default hover:shadow-xl hover:shadow-[#A8F0B5]/10 dark:hover:shadow-black/30 transition-shadow duration-300"
              >
                <motion.div
                  className="w-11 h-11 rounded-xl bg-[#F0FAF2] flex items-center justify-center mb-5"
                  whileHover={{ scale: 1.15, rotate: -6 }}
                  transition={{ type: "spring", stiffness: 380, damping: 14 }}
                >
                  <Icon className="w-5 h-5 text-[#008080]" />
                </motion.div>

                <h3 className="font-heading font-semibold text-[#0F1117] dark:text-white text-lg mb-2.5 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[#5D6370] dark:text-[#8A929E] text-sm leading-relaxed">
                  {feature.description}
                </p>

                <motion.div
                  className="mt-5 flex items-center gap-1.5 text-[#008080] text-xs font-medium"
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 0 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {t("learnMore")}
                  <motion.span
                    className="inline-flex"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </motion.span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
