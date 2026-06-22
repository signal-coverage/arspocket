"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className ?? "w-4 h-4 fill-current"}
    aria-hidden
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.068zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className ?? "w-4 h-4 fill-current"}
    aria-hidden
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className ?? "w-4 h-4 fill-current"}
    aria-hidden
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c.99.005 1.987.134 2.913.393 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const FOOTER_LINK_KEYS = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "Help Center", "Status", "Community"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
} as const;

export const LandingFooter = () => {
  const t = useTranslations("landing.footer");

  return (
    <footer className="bg-[#0F1117] text-white pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit group">
              <Image src="/logo.png" alt="ARSPocket" width={32} height={32} className="rounded-xl group-hover:scale-105 transition-transform" />
              <span className="font-heading font-semibold text-white text-[17px] tracking-tight">
                ARSPocket
              </span>
            </Link>
            <p className="text-[#6B7280] text-sm leading-relaxed max-w-[200px]">
              {t("tagline")}
            </p>

            <div className="flex gap-3 mt-5">
              {[
                { icon: XIcon, href: "#", label: "Twitter" },
                { icon: LinkedInIcon, href: "#", label: "LinkedIn" },
                { icon: GitHubIcon, href: "#", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#9CA3AF]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {(Object.entries(FOOTER_LINK_KEYS) as [keyof typeof FOOTER_LINK_KEYS, readonly string[]][]).map(([section, links]) => (
            <div key={section}>
              <p className="text-white font-medium text-sm mb-4">
                {t(`sections.${section}`)}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[#6B7280] hover:text-[#D1D5DB] text-sm transition-colors"
                    >
                      {t(`links.${link}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-[#6B7280] text-xs">
            © {new Date().getFullYear()} ARSPocket. {t("copyright")}
          </p>
          <p className="text-[#4B5563] text-xs">
            {t("builtWith")}
          </p>
        </div>
      </div>
    </footer>
  );
};
