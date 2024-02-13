import { memo } from "react";
import { FaColumns, FaProjectDiagram } from "react-icons/fa";
import { ApplicationMode } from "../AppLayout";

interface ModeBarProps {
  onChangeMode: (mode: ApplicationMode) => void;
  currentMode: ApplicationMode;
}

function ModeBar({ onChangeMode, currentMode }: ModeBarProps) {
  const modes: { name: ApplicationMode; icon: any }[] = [
    { name: "flow", icon: FaProjectDiagram },
    { name: "view", icon: FaColumns },
  ];

  const handleChangeMode = (newMode: ApplicationMode) => {
    onChangeMode(newMode);
  };

  return (
    <div className="z-10 flex h-full w-10 flex-col space-y-2 border-r-2 border-r-sky-900/10 p-2 pt-4">
      {modes.map((mode, index) => {
        const Icon = mode.icon;
        return (
          <Icon
            key={index}
            onClick={() => handleChangeMode(mode.name)}
            className={`w-full cursor-pointer text-2xl ${currentMode === mode.name ? "text-sky-300" : "text-sky-900/50 hover:text-sky-300/50"}`}
          />
        );
      })}
    </div>
  );
}

export default memo(ModeBar);
