"use client";

import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const TESTIMONIAL_META = [
  { name: "Sarah M.", role: "Product Manager", company: "Stripe", initials: "SM", color: "#008080" },
  { name: "Carlos R.", role: "Freelance Designer", company: "Independent", initials: "CR", color: "#5D3FD3" },
  { name: "Priya K.", role: "Software Engineer", company: "Vercel", initials: "PK", color: "#E07B39" },
  { name: "James T.", role: "Small Business Owner", company: "Independent", initials: "JT", color: "#C0392B" },
  { name: "Ana L.", role: "Marketing Director", company: "Linear", initials: "AL", color: "#2980B9" },
  { name: "David W.", role: "Financial Analyst", company: "Independent", initials: "DW", color: "#008080" },
];

const Stars = () => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
    ))}
  </div>
);

export const TestimonialsSection = () => {
  const t = useTranslations("landing.testimonials");
  const items = t.raw("items") as Array<{ review: string }>;

  return (
    <section id="testimonials" className="py-24 bg-[#F8FBF8] dark:bg-[#111419]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-[#008080] uppercase tracking-[0.12em] font-medium mb-3"
          >
            {t("sectionLabel")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl sm:text-4xl font-bold text-[#0F1117] dark:text-white tracking-tight"
          >
            {t("headline")}
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIAL_META.map((meta, i) => (
            <motion.div
              key={meta.name}
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
                &ldquo;{items[i]?.review}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: meta.color }}
                >
                  {meta.initials}
                </div>
                <div>
                  <p className="text-[#0F1117] dark:text-white text-sm font-semibold">
                    {meta.name}
                  </p>
                  <p className="text-[#9CA3AF] dark:text-[#5D6370] text-xs">
                    {meta.role} · {meta.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
