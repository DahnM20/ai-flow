import { ReactNode, memo, useCallback, useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import ConfigPopup from "./popups/configPopup/ConfigPopup";
import HelpPopup from "./popups/HelpPopup";
import DnDSidebar from "./bars/DndSidebar/DnDSidebar";
import RightIconButton from './buttons/ConfigurationButton';
import ModeBar from "./bars/ModeBar";
import { ApplicationMode } from "./FlowTabs";

interface FlowWrapperProps {
    children?: ReactNode;
    mode: ApplicationMode;
    openConfig: boolean;
    onCloseConfig: () => void;
    onOpenConfig: () => void;
    onChangeMode: (newMode: ApplicationMode) => void;
}

function FlowWrapper({ openConfig, mode, onCloseConfig, onOpenConfig, onChangeMode, children }: FlowWrapperProps) {
    const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

    const handleConfigClose = useCallback(() => {
        onCloseConfig();
    }, []);

    const handleOpenConfig = useCallback(() => {
        onOpenConfig();
    }, []);


    return (
        <>
            <div className="fixed left-0 top-0 
                            h-full
                            flex flex-row
                            z-10
                            mt-16">
                <ModeBar currentMode={mode} onChangeMode={onChangeMode} />
                {
                    mode === 'flow' &&
                    <DnDSidebar />
                }
            </div>
            <RightIconButton onClick={handleOpenConfig} />
            <RightIconButton onClick={() => setIsHelpOpen(true)} color='#7fcce38f' bottom='80px' icon={<FiHelpCircle />} />
            <ConfigPopup isOpen={openConfig} onClose={handleConfigClose} />
            {isHelpOpen && <HelpPopup isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />}
            {children}
        </>
    )

}

export default memo(FlowWrapper);