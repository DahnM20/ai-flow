import { ReactNode } from "react";

interface ActionGroupProps<T> {
  actions: Action<T>[];
  showIcon: boolean;
}

export interface Action<T> {
  name: string;
  icon: ReactNode;
  value: T;
  onClick: () => void;
  hoverColor?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

export default function ActionGroup<T>({
  actions: options,
  showIcon,
}: ActionGroupProps<T>) {
  return (
    <div
      className={`flex flex-row gap-x-2 
        `}
    >
      {options.map((option) => {
        return (
          <button
            key={option.name}
            className={`cursor-pointer 
                        rounded-full bg-slate-200/10
                        p-2
                        text-xl
                        text-stone-100
                        hover:bg-slate-200/20
                        ${option.hoverColor ? "hover:" + option.hoverColor : "hover:text-blue-400"}
                        `}
            onClick={option.onClick}
            onTouchStart={option.onClick}
            style={{ display: showIcon ? "block" : "none" }}
            data-tooltip-id={"app-tooltip"}
            data-tooltip-content={option.name}
            data-tooltip-place={option.tooltipPosition ?? "top"}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
}
