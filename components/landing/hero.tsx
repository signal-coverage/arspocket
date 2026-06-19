"use client";

import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  PlayIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  PiggyBankIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CoffeeIcon,
} from "lucide-react";
import Link from "next/link";
import { Show } from "@clerk/nextjs";

import { Button } from "@/components/ui";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

const FloatingCard = ({
  children,
  className,
  delay,
  floatOffset = 8,
  floatDuration = 4,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  floatOffset?: number;
  floatDuration?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: EASE, delay }}
    className={`absolute bg-white dark:bg-[#1E2228] rounded-2xl shadow-lg border border-[#F0F4F0] dark:border-white/[0.08] p-3 ${className}`}
  >
    <motion.div
      animate={{ y: [0, -floatOffset, 0] }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay + 0.6,
      }}
    >
      {children}
    </motion.div>
  </motion.div>
);

const PhoneMockup = () => (
  <div className="relative" style={{ width: 252, height: 512 }}>
    {/* Glow */}
    <div
      className="absolute inset-[-60px] -z-10 blur-3xl"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(168,240,181,0.45) 0%, rgba(0,128,128,0.12) 45%, transparent 70%)",
      }}
    />

    {/* Phone shell */}
    <div
      className="relative w-full h-full rounded-[44px] p-[10px] shadow-2xl"
      style={{
        background: "linear-gradient(145deg, #2A2A2A 0%, #1A1A1A 100%)",
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 2px 0 rgba(255,255,255,0.12) inset",
        transform: "perspective(1200px) rotateY(-8deg) rotateX(4deg)",
      }}
    >
      {/* Side buttons */}
      <div className="absolute right-[-4px] top-[88px] w-[4px] h-[48px] rounded-r-sm bg-[#1A1A1A]" />
      <div className="absolute left-[-4px] top-[72px] w-[4px] h-[32px] rounded-l-sm bg-[#1A1A1A]" />
      <div className="absolute left-[-4px] top-[116px] w-[4px] h-[56px] rounded-l-sm bg-[#1A1A1A]" />

      {/* Screen */}
      <div className="w-full h-full rounded-[36px] overflow-hidden bg-[#F4F9F5]">
        {/* Status bar */}
        <div className="bg-[#0F1117] px-4 pt-2 pb-1 flex items-center justify-between">
          <span className="text-white text-[10px] font-mono font-medium">
            9:41
          </span>
          <div className="w-20 h-4 rounded-full bg-[#1A1A1A]" />
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px] items-end h-3">
              {[3, 5, 7, 9].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-sm bg-white"
                  style={{ height: h }}
                />
              ))}
            </div>
            <div className="w-4 h-2.5 rounded-sm border border-white/60 relative ml-0.5">
              <div className="absolute inset-[2px] right-[3px] bg-white rounded-[1px]" />
              <div className="absolute right-[-3px] top-[3px] w-[2px] h-[4px] bg-white/60 rounded-r-[1px]" />
            </div>
          </div>
        </div>

        {/* App header */}
        <div className="bg-[#0F1117] px-4 pt-2 pb-4 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[10px]">Good morning 👋</p>
            <p className="text-white font-heading font-semibold text-sm">
              ARSPocket
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#A8F0B5]/20 flex items-center justify-center">
            <BellIcon className="w-3.5 h-3.5 text-[#A8F0B5]" />
          </div>
        </div>

        {/* Balance card */}
        <div
          className="mx-3 -mt-2 rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #008080 0%, #005F5F 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
            style={{ background: "#A8F0B5", transform: "translate(30%, -30%)" }}
          />
          <p className="text-white/70 text-[9px] uppercase tracking-widest font-medium">
            Total Balance
          </p>
          <p className="text-white font-heading font-bold text-2xl mt-0.5">
            $12,450
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpIcon className="w-2.5 h-2.5 text-[#A8F0B5]" />
            <span className="text-[#A8F0B5] text-[9px] font-medium">
              +12.4% vs last month
            </span>
          </div>
        </div>

        {/* Income / Expenses row */}
        <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
          <div className="bg-white rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <ArrowUpIcon className="w-2.5 h-2.5 text-[#008080]" />
              <span className="text-[#5D6370] text-[8px] font-medium">
                Income
              </span>
            </div>
            <p className="font-heading font-bold text-[13px] text-[#0F1117]">
              $3,200
            </p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <ArrowDownIcon className="w-2.5 h-2.5 text-[#bb4430]" />
              <span className="text-[#5D6370] text-[8px] font-medium">
                Expenses
              </span>
            </div>
            <p className="font-heading font-bold text-[13px] text-[#0F1117]">
              $1,847
            </p>
          </div>
        </div>

        {/* Savings goal */}
        <div className="mx-3 mt-3 bg-white rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#0F1117] text-[9px] font-medium">
              Vacation Fund
            </span>
            <span className="text-[#008080] text-[9px] font-bold">68%</span>
          </div>
          <div className="h-1.5 bg-[#F0FAF2] rounded-full overflow-hidden">
            <div
              className="h-full w-[68%] rounded-full"
              style={{ background: "linear-gradient(90deg, #008080, #A8F0B5)" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[#5D6370] text-[8px]">$6,800</span>
            <span className="text-[#5D6370] text-[8px]">$10,000</span>
          </div>
        </div>

        {/* Transactions */}
        <div className="mx-3 mt-3">
          <p className="text-[#5D6370] text-[8px] font-medium mb-2">RECENT</p>
          {[
            {
              icon: CoffeeIcon,
              label: "Coffee",
              amount: "-$4.50",
              color: "text-[#bb4430]",
              bg: "bg-[#FFF3F0]",
            },
            {
              icon: TrendingUpIcon,
              label: "Salary",
              amount: "+$3,200",
              color: "text-[#008080]",
              bg: "bg-[#F0FAF2]",
            },
            {
              icon: ArrowDownIcon,
              label: "Rent",
              amount: "-$1,200",
              color: "text-[#bb4430]",
              bg: "bg-[#FFF3F0]",
            },
          ].map((tx) => (
            <div key={tx.label} className="flex items-center gap-2 mb-2">
              <div
                className={`w-6 h-6 rounded-full ${tx.bg} flex items-center justify-center shrink-0`}
              >
                <tx.icon className="w-3 h-3 text-[#5D6370]" />
              </div>
              <span className="text-[#0F1117] text-[9px] font-medium flex-1">
                {tx.label}
              </span>
              <span className={`text-[9px] font-bold font-mono ${tx.color}`}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const HeroSection = () => (
  <section className="relative min-h-screen flex items-center bg-white dark:bg-[#0F1117] overflow-hidden pt-16">
    {/* Background decoration */}
    <div
      className="absolute inset-0 -z-10 opacity-40"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 70% 40%, rgba(168,240,181,0.25) 0%, transparent 60%)",
      }}
    />
    <div
      className="absolute top-0 right-0 w-[600px] h-[600px] -z-10 opacity-30 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(0,128,128,0.15) 0%, transparent 70%)",
      }}
    />

    <div className="max-w-[1200px] mx-auto px-6 py-20 w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left — copy */}
      <div className="flex flex-col gap-6">
        <motion.div {...fadeUp(0.05)}>
          <span className="inline-flex items-center gap-2 bg-[#F0FAF2] dark:bg-[#A8F0B5]/10 border border-[#A8F0B5]/50 text-[#008080] dark:text-[#A8F0B5] rounded-full px-3.5 py-1.5 text-xs font-medium">
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            Trusted by 10,000+ users
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.12)}
          className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight text-[#0F1117] dark:text-white"
        >
          Take control of your{" "}
          <span className="relative inline-block">
            finances
            <span
              className="absolute bottom-1 left-0 right-0 h-3 -z-10 opacity-50 rounded-sm"
              style={{ background: "#A8F0B5" }}
            />
          </span>{" "}
          with confidence.
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="text-[#5D6370] dark:text-[#8A929E] text-lg leading-relaxed max-w-md"
        >
          Track income, expenses, savings, debts and financial goals in one
          simple platform built for clarity.
        </motion.p>

        <motion.div {...fadeUp(0.28)} className="flex flex-wrap gap-3">
          <Show when="signed-out">
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-[#0F1117] text-white rounded-xl px-6 h-12 text-sm font-medium gap-2 shadow-md hover:shadow-lg transition-shadow"
                >
                  Get Started Free
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </Show>
          <Show when="signed-in">
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#0F1117] text-white rounded-xl px-6 h-12 text-sm font-medium gap-2 shadow-md hover:shadow-lg transition-shadow"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </Show>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-6 h-12 text-sm font-medium gap-2 border-[#E8F5E9] dark:border-white/10 hover:bg-[#F0FAF2] dark:hover:bg-white/5 text-[#0F1117] dark:text-white"
            >
              <PlayIcon className="w-4 h-4 fill-current" />
              View Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          {...fadeUp(0.35)}
          className="text-xs text-[#9CA3AF] dark:text-[#6B7280]"
        >
          No credit card required · Free plan forever · Cancel anytime
        </motion.p>
      </div>

      {/* Right — phone mockup */}
      <div className="relative flex items-center justify-center min-h-[520px]">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          >
            <PhoneMockup />
          </motion.div>
        </motion.div>

        {/* Floating card: income */}
        <FloatingCard
          delay={0.6}
          floatOffset={7}
          floatDuration={3.8}
          className="top-8 right-0 lg:right-[-24px] min-w-[148px]"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#F0FAF2] flex items-center justify-center">
              <TrendingUpIcon className="w-3.5 h-3.5 text-[#008080]" />
            </div>
            <span className="text-[11px] text-[#5D6370] font-medium">
              Monthly Income
            </span>
          </div>
          <p className="font-heading font-bold text-[#0F1117] dark:text-white text-lg">
            +$3,200
          </p>
          <p className="text-[10px] text-[#A8F0B5] font-medium mt-0.5">
            ↑ 8.2% vs last month
          </p>
        </FloatingCard>

        {/* Floating card: savings */}
        <FloatingCard
          delay={0.75}
          floatOffset={10}
          floatDuration={4.5}
          className="bottom-16 left-0 lg:left-[-24px] min-w-[140px]"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#F0FAF2] flex items-center justify-center">
              <PiggyBankIcon className="w-3.5 h-3.5 text-[#008080]" />
            </div>
            <span className="text-[11px] text-[#5D6370] font-medium">
              Savings
            </span>
          </div>
          <p className="font-heading font-bold text-[#0F1117] dark:text-white text-lg">
            68%
          </p>
          <p className="text-[10px] text-[#5D6370] mt-0.5">Vacation fund</p>
        </FloatingCard>

        {/* Floating card: goal */}
        <FloatingCard
          delay={0.9}
          floatOffset={6}
          floatDuration={3.2}
          className="bottom-40 right-0 lg:right-[-16px] min-w-[136px]"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🎯</span>
            <span className="text-[10px] text-[#5D6370] font-medium">
              Goal reached!
            </span>
          </div>
          <p className="text-[11px] text-[#0F1117] dark:text-white font-semibold">
            Emergency fund
          </p>
          <p className="text-[9px] text-[#A8F0B5] font-medium mt-0.5">
            $5,000 saved ✓
          </p>
        </FloatingCard>
      </div>
    </div>
  </section>
);
