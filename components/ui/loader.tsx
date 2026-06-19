import { LoaderCircle } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex min-h-full items-center justify-center">
      <LoaderCircle width={24} className="animate-spin text-primary" />
    </div>
  );
};

export default Loader;
