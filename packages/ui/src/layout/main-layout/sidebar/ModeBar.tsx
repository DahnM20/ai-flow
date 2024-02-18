import { memo } from "react";
import { FaColumns, FaProjectDiagram } from "react-icons/fa";
import { ApplicationMode, ApplicationMenu } from "../AppLayout";
import { FiFile } from "react-icons/fi";

interface ModeBarProps {
  onChangeMode: (mode: ApplicationMode) => void;
  onOpenMenu: (menu: ApplicationMenu) => void;
  currentMode: ApplicationMode;
}

function ModeBar({ onChangeMode, onOpenMenu, currentMode }: ModeBarProps) {
  const modes: { name: ApplicationMode; icon: any }[] = [
    { name: "flow", icon: FaProjectDiagram },
    { name: "view", icon: FaColumns },
  ];

  const menus: { name: ApplicationMenu; icon: any }[] = [
    { name: "template", icon: FiFile },
  ];

  function handleChangeMode(newMode: ApplicationMode) {
    onChangeMode(newMode);
  }

  function handleOpenMenu(name: ApplicationMenu) {
    onOpenMenu(name);
  }

  return (
    <div className="z-10 flex h-full min-w-[2.5rem] flex-col justify-between border-r-2 border-r-sky-900/10 p-2 pt-4">
      <div className="space-y-2">
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
      <div className="mb-2">
        {menus.map((menu, index) => {
          const Icon = menu.icon;
          return (
            <Icon
              key={index}
              onClick={() => handleOpenMenu(menu.name)}
              className="w-full cursor-pointer text-2xl text-sky-900/50 hover:text-sky-300/50"
            />
          );
        })}
      </div>
    </div>
  );
}

export default memo(ModeBar);
