"use client";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

const LoadingSpinner = ({ size = "medium" }: LoadingSpinnerProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-4 w-4";
      case "large":
        return "h-12 w-12";
      default:
        return "h-8 w-8";
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className={`${getSizeClasses()} animate-spin rounded-full border-b-2 border-t-2 border-green-500`}></div>
    </div>
  );
};

export default LoadingSpinner;
