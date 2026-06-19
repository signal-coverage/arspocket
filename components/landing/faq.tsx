"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";

const FAQS = [
  {
    q: "Is my data secure?",
    a: "Yes. ARSPocket uses end-to-end encryption for all sensitive data and follows bank-grade security standards. Your financial information is never shared with third parties without your explicit consent.",
  },
  {
    q: "Can I track debts?",
    a: "Absolutely. ARSPocket lets you add credit cards, personal loans, mortgages, and any other liabilities. You can monitor balances, interest rates, minimum payments, and projected payoff dates.",
  },
  {
    q: "Can I manage savings goals?",
    a: "Yes. You can create as many savings goals as you need — emergency fund, vacation, home purchase, retirement, or anything custom. Set a target amount, a deadline, and track your progress in real time.",
  },
  {
    q: "Is there a free plan?",
    a: "ARSPocket offers a free plan with core income and expense tracking, up to three savings goals, and a 6-month transaction history. Paid plans unlock unlimited history, advanced reporting, goal automation, and more.",
  },
  {
    q: "Can I export my reports?",
    a: "Yes. You can export your transaction history and monthly summaries as CSV or PDF from the Reports section. Custom date ranges are available on the Pro and Business plans.",
  },
];

export const FaqSection = () => (
  <section id="faq" className="py-24 bg-white dark:bg-[#0F1117]">
    <div className="max-w-[720px] mx-auto px-6">
      <div className="text-center mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-[#008080] uppercase tracking-[0.12em] font-medium mb-3"
        >
          FAQ
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-3xl sm:text-4xl font-bold text-[#0F1117] dark:text-white tracking-tight"
        >
          Questions we get a lot
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
          {FAQS.map((faq, i) => (
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
