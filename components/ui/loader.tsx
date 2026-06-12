import { LoaderCircle } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex min-h-full min-w-100 items-center justify-center bg-muted">
      <LoaderCircle width={24} className="animate-spin text-primary" />
    </div>
  );
};

export default Loader;
