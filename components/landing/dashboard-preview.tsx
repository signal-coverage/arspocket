"use client";

import { motion } from "framer-motion";
import {
  TrendingUpIcon,
  WalletIcon,
  PiggyBankIcon,
  TargetIcon,
  HomeIcon,
  BarChart2Icon,
  SettingsIcon,
} from "lucide-react";

const Bar = ({ height, color }: { height: number; color: string }) => (
  <div
    className="w-5 rounded-t-md transition-all duration-300"
    style={{ height, background: color }}
  />
);

export const DashboardPreview = () => (
  <section id="how-it-works" className="py-24 bg-[#F8FBF8] dark:bg-[#111419]">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="text-center max-w-xl mx-auto mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-[#008080] uppercase tracking-[0.12em] font-medium mb-3"
        >
          Dashboard
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-3xl sm:text-4xl font-bold text-[#0F1117] dark:text-white tracking-tight"
        >
          Your whole financial life in one view
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 border border-[#E8F5E9] dark:border-white/[0.06]"
      >
        {/* Browser chrome */}
        <div className="bg-[#F4F4F4] dark:bg-[#1E2228] px-4 py-3 flex items-center gap-3 border-b border-[#E0E0E0] dark:border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 max-w-xs mx-auto">
            <div className="bg-white dark:bg-[#0F1117] rounded-md px-3 py-1 text-xs text-[#9CA3AF] dark:text-[#5D6370] text-center">
              app.arspocket.com/dashboard
            </div>
          </div>
        </div>

        {/* App shell */}
        <div
          className="bg-white dark:bg-[#0F1117] flex"
          style={{ minHeight: 440 }}
        >
          {/* Sidebar */}
          <div className="hidden sm:flex w-[200px] shrink-0 border-r border-[#E8F5E9] dark:border-white/[0.06] flex-col py-4 px-3 gap-1">
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-[#F0FAF2] dark:bg-[#A8F0B5]/10 mb-2">
              <HomeIcon className="w-4 h-4 text-[#008080]" />
              <span className="text-xs font-medium text-[#008080]">
                Overview
              </span>
            </div>
            {[
              { label: "Income", icon: TrendingUpIcon },
              { label: "Expenses", icon: WalletIcon },
              { label: "Savings", icon: PiggyBankIcon },
              { label: "Goals", icon: TargetIcon },
              { label: "Reports", icon: BarChart2Icon },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-[#F8FBF8] dark:hover:bg-white/[0.03] cursor-default"
              >
                <Icon className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-xs text-[#5D6370] dark:text-[#6B7280]">
                  {label}
                </span>
              </div>
            ))}
            <div className="mt-auto flex items-center gap-2 px-2 py-2 cursor-default">
              <SettingsIcon className="w-4 h-4 text-[#9CA3AF]" />
              <span className="text-xs text-[#5D6370] dark:text-[#6B7280]">
                Settings
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-semibold text-[#0F1117] dark:text-white text-base">
                  Overview
                </h3>
                <p className="text-xs text-[#9CA3AF]">June 2025</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-[#F0FAF2] dark:bg-[#A8F0B5]/10 text-xs text-[#008080] font-medium cursor-default">
                  Monthly
                </div>
                <div className="px-3 py-1.5 rounded-lg text-xs text-[#9CA3AF] cursor-default">
                  Yearly
                </div>
              </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: "Balance",
                  value: "$12,450",
                  change: "+12.4%",
                  up: true,
                },
                { label: "Income", value: "$3,200", change: "+8.2%", up: true },
                {
                  label: "Expenses",
                  value: "$1,847",
                  change: "-3.1%",
                  up: false,
                },
                { label: "Saved", value: "$1,353", change: "+22%", up: true },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="bg-[#F8FBF8] dark:bg-[#1A1A25] rounded-xl p-3"
                >
                  <p className="text-[10px] text-[#9CA3AF] mb-1">{kpi.label}</p>
                  <p className="font-heading font-bold text-[#0F1117] dark:text-white text-sm">
                    {kpi.value}
                  </p>
                  <p
                    className={`text-[10px] font-medium mt-0.5 ${kpi.up ? "text-[#008080]" : "text-[#bb4430]"}`}
                  >
                    {kpi.change}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-[#F8FBF8] dark:bg-[#1A1A25] rounded-xl p-4">
              <p className="text-xs font-medium text-[#0F1117] dark:text-white mb-4">
                Monthly Cash Flow
              </p>
              <div className="flex items-end gap-2 h-24">
                {[
                  [52, 38],
                  [68, 42],
                  [48, 55],
                  [75, 40],
                  [62, 48],
                  [80, 44],
                  [90, 52],
                  [72, 38],
                  [85, 46],
                  [94, 50],
                  [78, 44],
                  [100, 48],
                ].map(([inc, exp], i) => (
                  <div key={i} className="flex gap-0.5 items-end flex-1">
                    <Bar height={inc * 0.96} color="#008080" />
                    <Bar height={exp * 0.96} color="#A8F0B5" />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-[#008080]" />
                  <span className="text-[10px] text-[#9CA3AF]">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-[#A8F0B5]" />
                  <span className="text-[10px] text-[#9CA3AF]">Expenses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
