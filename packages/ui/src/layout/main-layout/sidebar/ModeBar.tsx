import { memo } from "react";
import { FaColumns, FaProjectDiagram } from "react-icons/fa";
import { ApplicationMode } from "../AppLayout";

interface ModeBarProps {
    onChangeMode: (mode: ApplicationMode) => void;
    currentMode: ApplicationMode;
}

function ModeBar({ onChangeMode, currentMode }: ModeBarProps) {
    const modes: { name: ApplicationMode, icon: any }[] = [
        { name: 'flow', icon: FaProjectDiagram },
        { name: 'view', icon: FaColumns },
    ];

    const handleChangeMode = (newMode: ApplicationMode) => {
        onChangeMode(newMode);
    };

    return (
        <div className="w-10 h-full flex flex-col space-y-2 pt-4 p-2 z-10 border-r-2  border-r-sky-900/10">
            {modes.map((mode, index) => {
                const Icon = mode.icon;
                return (
                    <Icon
                        key={index}
                        onClick={() => handleChangeMode(mode.name)}
                        className={`w-full text-2xl cursor-pointer ${currentMode === mode.name ? 'text-sky-300' : 'text-sky-900/50 hover:text-sky-300/50'}`}
                    />
                );
            })}
        </div>
    )
}

export default memo(ModeBar);