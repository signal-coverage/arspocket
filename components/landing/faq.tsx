"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";

export const FaqSection = () => {
  const t = useTranslations("landing.faq");
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="py-24 bg-white dark:bg-[#0F1117]">
      <div className="max-w-[720px] mx-auto px-6">
        <div className="text-center mb-14">
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion
            type="single"
            collapsible
            className="border-[#E8F5E9] dark:border-white/[0.06] rounded-2xl overflow-hidden"
          >
            {items.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-[#E8F5E9] dark:border-white/[0.06]"
              >
                <AccordionTrigger className="text-[#0F1117] dark:text-white font-medium text-sm px-5 py-4 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#5D6370] dark:text-[#8A929E] text-sm px-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
