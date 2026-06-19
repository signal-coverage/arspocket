"use client";

import { motion } from "framer-motion";

const LOGOS = [
  { name: "Stripe", weight: "800", spacing: "-0.04em", size: "1.25rem" },
  { name: "Shopify", weight: "600", spacing: "0em", size: "1.1rem" },
  { name: "Notion", weight: "700", spacing: "-0.02em", size: "1.15rem" },
  { name: "Vercel", weight: "800", spacing: "-0.05em", size: "1.2rem" },
  { name: "Linear", weight: "600", spacing: "-0.03em", size: "1.1rem" },
  { name: "Figma", weight: "700", spacing: "0em", size: "1.15rem" },
  { name: "GitHub", weight: "600", spacing: "-0.02em", size: "1.1rem" },
  { name: "Loom", weight: "800", spacing: "-0.03em", size: "1.25rem" },
];

const LogoItem = ({ logo }: { logo: (typeof LOGOS)[0] }) => (
  <span
    className="shrink-0 font-heading text-[#C4C4C4] dark:text-[#3A3A3A] select-none px-8"
    style={{
      fontWeight: logo.weight,
      letterSpacing: logo.spacing,
      fontSize: logo.size,
    }}
  >
    {logo.name}
  </span>
);

export const SocialProof = () => (
  <section className="py-14 border-t border-b border-[#E8F5E9] dark:border-white/[0.06] bg-white dark:bg-[#0F1117] overflow-hidden">
    <div className="max-w-[1200px] mx-auto px-6">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center text-xs text-[#9CA3AF] dark:text-[#5D6370] uppercase tracking-[0.12em] font-medium mb-10"
      >
        Trusted by teams at world-class companies
      </motion.p>
    </div>

    {/* Marquee — no max-width constraint, full bleed */}
    <div className="relative">
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, white, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, white, transparent)" }}
      />

      <div className="flex overflow-hidden">
        <motion.div
          className="flex items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <LogoItem key={i} logo={logo} />
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);
