import { SignUp } from "@clerk/nextjs";
import { LeafIcon, CheckIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Loader } from "@/components/ui";

const FEATURES = [
  "Free forever — no credit card required",
  "Set up your first budget in under 2 minutes",
  "Secure and private, your data stays yours",
];

export const SignUpPage = () => (
  <div className="min-h-svh grid lg:grid-cols-2">
    {/* Brand panel */}
    <div className="hidden lg:flex flex-col bg-[#0F1117] p-12 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-125 h-125 opacity-25 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(168,240,181,0.6) 0%, rgba(0,128,128,0.3) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-75 h-75 opacity-10 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #008080 0%, transparent 70%)",
        }}
      />

      <Link href="/" className="flex items-center gap-2.5 w-fit">
        <div className="w-9 h-9 rounded-xl bg-[#008080] flex items-center justify-center shadow-sm">
          <LeafIcon className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-white text-lg">ARSPocket</span>
      </Link>

      <div className="flex-1 flex flex-col justify-center gap-8">
        <div>
          <h2 className="text-3xl font-bold text-white leading-tight tracking-tight mb-3">
            Start building
            <br />
            <span className="text-[#A8F0B5]">better habits.</span>
          </h2>
          <p className="text-[#8A929E] text-base leading-relaxed max-w-xs">
            Join thousands of users who track their money smarter every day.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#A8F0B5]/15 border border-[#A8F0B5]/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckIcon className="w-3 h-3 text-[#A8F0B5]" />
              </div>
              <span className="text-[#C9D1D9] text-sm leading-relaxed">
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[#5D6370] text-xs">
        Trusted by 10,000+ users worldwide.
      </p>
    </div>

    {/* Auth panel */}
    <div className="flex flex-col items-center justify-center min-h-svh bg-white p-6 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-[#5D6370] hover:text-[#0F1117] transition-colors"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5" />
        Back
      </Link>

      <SignUp
        signInUrl="/signin"
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#008080",
            borderRadius: "8px",
            fontFamily: "inherit",
          },
          elements: {
            card: "shadow-none border-0 p-0",
            rootBox: "w-full",
          },
        }}
        fallback={<Loader />}
      />
    </div>
  </div>
);

export default SignUpPage;
