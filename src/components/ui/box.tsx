import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return <div className={twMerge("h-fit w-full rounded-lg bg-neutral-900 p-4", className)}>{children}</div>;
};

export default Box;
