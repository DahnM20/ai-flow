import React, { ReactNode } from "react";

interface OptionSelectorProps<T> {
  options: Option<T>[];
  selectedOption?: T;
  onSelectOption: (option: Option<T>) => void;
  showLabels?: boolean;
}

export interface Option<T> {
  name: string;
  icon: ReactNode;
  value: T;
}

export default function OptionSelector<T>({
  options,
  selectedOption,
  onSelectOption,
  showLabels,
}: OptionSelectorProps<T>) {
  return (
    <div className="flex flex-row items-center justify-center space-x-3 py-2">
      {options.map((option) => {
        const isSelected = selectedOption === option.value;
        return (
          <div
            key={option.name}
            className={`
                        flex cursor-pointer
                        flex-row items-center
                        justify-center rounded-lg
                        p-2
                        hover:bg-blue-400/50
                        ${isSelected ? "bg-blue-400 text-white" : " bg-slate-200/10 text-stone-100"}
                        `}
            onClick={() => onSelectOption(option)}
          >
            {option.icon}
            {showLabels && <span className="ml-2">{option.name}</span>}
          </div>
        );
      })}
    </div>
  );
}
