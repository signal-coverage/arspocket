"use client";

import { motion } from "framer-motion";
import { EyeIcon, CalendarCheckIcon, CreditCardIcon } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BENEFITS = [
  {
    icon: EyeIcon,
    title: "Financial Clarity",
    description:
      "Stop guessing where your money goes. Get a unified view of every transaction, account, and goal — all in one dashboard that updates in real time.",
    from: { x: -48, opacity: 0 },
  },
  {
    icon: CalendarCheckIcon,
    title: "Goal Planning",
    description:
      "Break big financial ambitions into achievable milestones. Set savings targets, track contributions, and celebrate every step forward.",
    from: { y: 48, opacity: 0 },
  },
  {
    icon: CreditCardIcon,
    title: "Debt Management",
    description:
      "See your full debt picture in one place. Track balances, interest rates, and payoff timelines so you can reduce liabilities faster.",
    from: { x: 48, opacity: 0 },
  },
];

export const BenefitsSection = () => (
  <section className="py-24 relative overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, #0D3B26 0%, #1A5C3A 50%, #0F4A30 100%)",
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    <div
      className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 blur-3xl"
      style={{
        background: "radial-gradient(circle, #A8F0B5 0%, transparent 70%)",
      }}
    />

    <div className="relative max-w-[1200px] mx-auto px-6">
      <div className="text-center max-w-xl mx-auto mb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs text-[#A8F0B5]/70 uppercase tracking-[0.12em] font-medium mb-3"
        >
          Why ARSPocket
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
          className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight"
        >
          Built around the way you actually think about money
        </motion.h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {BENEFITS.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={benefit.from}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-2xl p-7 border border-white/10 hover:border-[#A8F0B5]/40 transition-colors duration-300 cursor-default"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              className="w-11 h-11 rounded-xl bg-[#A8F0B5]/15 flex items-center justify-center mb-5"
              whileHover={{
                scale: 1.12,
                backgroundColor: "rgba(168,240,181,0.25)",
              }}
              transition={{ type: "spring", stiffness: 380, damping: 14 }}
            >
              <benefit.icon className="w-5 h-5 text-[#A8F0B5]" />
            </motion.div>
            <h3 className="font-heading font-semibold text-white text-lg mb-2.5 tracking-tight">
              {benefit.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
