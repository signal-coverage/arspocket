"use client";

import { motion } from "framer-motion";
import {
  TrendingUpIcon,
  WalletIcon,
  TargetIcon,
  ArrowRightIcon,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FEATURES = [
  {
    icon: TrendingUpIcon,
    title: "Income Tracking",
    description:
      "Monitor every salary, freelance payment, and passive income stream in real time. Get a clear picture of what's coming in and where it's coming from.",
  },
  {
    icon: WalletIcon,
    title: "Expense Management",
    description:
      "Automatically categorize your spending. Spot subscriptions you forgot about, track daily habits, and understand exactly where your money goes each month.",
  },
  {
    icon: TargetIcon,
    title: "Savings Goals",
    description:
      "Define a target, set a deadline, and track progress toward each goal. Whether it's an emergency fund or a dream vacation — ARSPocket keeps you on course.",
  },
];

export const FeaturesSection = () => (
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
          Features
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="font-heading text-3xl sm:text-4xl font-bold text-[#0F1117] dark:text-white tracking-tight"
        >
          Everything you need to manage your money
        </motion.h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
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
              <feature.icon className="w-5 h-5 text-[#008080]" />
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
              Learn more
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
        ))}
      </div>
    </div>
  </section>
);
