"use client";

import * as React from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  max?: number;
}

const Slider: React.FC<SliderProps> = ({ value = 1, onChange, disabled = false, className = "", max = 1 }) => {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <RadixSlider.Root
      className={`relative flex items-center select-none touch-none w-full h-7 group ${className}`}
      defaultValue={[value]}
      value={[value]}
      onValueChange={handleChange}
      disabled={disabled}
      max={max}
      step={0.01}
      aria-label="Progress"
    >
      <RadixSlider.Track className="bg-neutral-700 relative grow rounded-full h-1 group-hover:h-1.5 transition-all">
        <RadixSlider.Range className="absolute bg-neutral-400 group-hover:bg-green-500 rounded-full h-full transition-colors" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="hidden group-hover:block w-3 h-3 bg-white rounded-full focus:outline-none transition-all"
        aria-label="Progress"
      />
    </RadixSlider.Root>
  );
};

export default Slider;
