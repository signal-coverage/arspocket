"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

const RAW_STATS = [
  { prefix: "$", value: 50, suffix: "M+" },
  { prefix: "", value: 120, suffix: "K+" },
  { prefix: "", value: 95, suffix: "%" },
  { prefix: "", value: 15, suffix: "+" },
];

const CountUp = ({
  value,
  prefix,
  suffix,
  duration = 1.6,
}: {
  value: number;
  prefix: string;
  suffix: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(value);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export const StatsSection = () => {
  const t = useTranslations("landing.stats");
  const items = t.raw("items") as Array<{ label: string; sub: string }>;

  return (
    <section className="py-24 bg-white dark:bg-[#0F1117]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {RAW_STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                delay: i * 0.09,
              }}
              className="text-center group"
            >
              <p className="font-heading font-bold text-4xl lg:text-5xl text-[#0F1117] dark:text-white tracking-tight">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={1.6 + i * 0.1}
                />
              </p>
              <p className="font-medium text-[#0F1117] dark:text-white text-sm mt-2.5">
                {items[i]?.label}
              </p>
              <p className="text-[#9CA3AF] dark:text-[#5D6370] text-xs mt-1">
                {items[i]?.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
