import { SignUp } from "@clerk/nextjs";
import Loader from "@/components/ui/loader";
import background from "@/assets/images/background.png";
import signUpImage from "@/assets/images/stocks-2.png";

export default function SignUpPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-6 md:p-10"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex min-h-140 w-full overflow-hidden border rounded-xl bg-muted">
          <SignUp
            signInUrl="/signin"
            appearance={{
              variables: {
                colorPrimary: "var(--primary)",
                borderRadius: "0",
              },
            }}
            fallback={<Loader />}
          />
          <div
            className="hidden md:block w-full min-h-96 self-stretch bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${signUpImage.src})` }}
          />
        </div>
      </div>
    </div>
  );
}
