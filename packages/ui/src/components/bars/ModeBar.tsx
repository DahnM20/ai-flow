import { memo, useState } from "react";
import { FiTrendingUp, FiEye } from "react-icons/fi";
import { ApplicationMode } from "../FlowTabs";

interface ModeBarProps {
    onChangeMode: (mode: ApplicationMode) => void;
    currentMode: ApplicationMode;
}

function ModeBar({ onChangeMode, currentMode }: ModeBarProps) {
    const modes: { name: ApplicationMode, icon: any }[] = [
        { name: 'flow', icon: FiTrendingUp },
        { name: 'view', icon: FiEye },
    ];

    const handleChangeMode = (newMode: ApplicationMode) => {
        onChangeMode(newMode);
    };

    return (
        <div className="w-10 h-full flex flex-col space-y-2 pt-4 z-10 bg-zinc-900 shadow-md border-r-2 border-r-sky-900/50">
            {modes.map((mode, index) => {
                const Icon = mode.icon;
                return (
                    <Icon
                        key={index}
                        onClick={() => handleChangeMode(mode.name)}
                        className={`w-full text-2xl cursor-pointer ${currentMode === mode.name ? 'text-sky-300' : 'text-sky-900/50 hover:text-sky-300'}`}
                    />
                );
            })}
        </div>
    )
}

export default memo(ModeBar);