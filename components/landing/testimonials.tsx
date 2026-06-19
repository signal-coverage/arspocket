"use client";

import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Product Manager",
    company: "Stripe",
    review:
      "ARSPocket completely changed how I relate to my finances. I used to avoid checking my accounts — now I open the app every morning.",
    initials: "SM",
    color: "#008080",
  },
  {
    name: "Carlos R.",
    role: "Freelance Designer",
    company: "Independent",
    review:
      "Tracking variable income used to be a nightmare. Now I can see exactly what's coming in from each client and plan accordingly.",
    initials: "CR",
    color: "#5D3FD3",
  },
  {
    name: "Priya K.",
    role: "Software Engineer",
    company: "Vercel",
    review:
      "The savings goals feature is genuinely incredible. I hit my emergency fund target three months earlier than planned.",
    initials: "PK",
    color: "#E07B39",
  },
  {
    name: "James T.",
    role: "Small Business Owner",
    company: "Independent",
    review:
      "Finally an app that handles both my personal and business expenses without getting complicated. Clean, fast, and reliable.",
    initials: "JT",
    color: "#C0392B",
  },
  {
    name: "Ana L.",
    role: "Marketing Director",
    company: "Linear",
    review:
      "The dashboard is beautiful. I've shown it to colleagues and half of them signed up on the spot. Best financial app I've used.",
    initials: "AL",
    color: "#2980B9",
  },
  {
    name: "David W.",
    role: "Financial Analyst",
    company: "Independent",
    review:
      "Even as someone who works in finance professionally, I use ARSPocket daily for my personal accounts. The UX is unmatched.",
    initials: "DW",
    color: "#008080",
  },
];

const Stars = () => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
    ))}
  </div>
);

export const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 bg-[#F8FBF8] dark:bg-[#111419]">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="text-center max-w-xl mx-auto mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-[#008080] uppercase tracking-[0.12em] font-medium mb-3"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-3xl sm:text-4xl font-bold text-[#0F1117] dark:text-white tracking-tight"
        >
          People who changed how they think about money
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.07,
            }}
            className="bg-white dark:bg-[#1A1A25] border border-[#E8F5E9] dark:border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4"
          >
            <Stars />
            <p className="text-[#4B5563] dark:text-[#9CA3AF] text-sm leading-relaxed flex-1">
              &ldquo;{t.review}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-[#0F1117] dark:text-white text-sm font-semibold">
                  {t.name}
                </p>
                <p className="text-[#9CA3AF] dark:text-[#5D6370] text-xs">
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
