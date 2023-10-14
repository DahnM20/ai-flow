import { ReactNode, memo, useCallback, useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import ConfigPopup from "./popups/ConfigPopup";
import HelpPopup from "./popups/HelpPopup";
import DnDSidebar from "./side-views/DnDSidebar";
import RightIconButton from './buttons/ConfigurationButton';

interface FlowWrapperProps {
    children?: ReactNode;
    user?: any;
    openConfig: boolean;
    onCloseConfig: () => void;
    onOpenConfig: () => void;
}

function FlowWrapper({ user, openConfig, onCloseConfig, onOpenConfig, children }: FlowWrapperProps) {
    const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

    const handleConfigClose = useCallback(() => {
        onCloseConfig();
    }, []);

    const handleOpenConfig = useCallback(() => {
        onOpenConfig();
    }, []);


    return (
        <>
            <DnDSidebar />
            <RightIconButton onClick={handleOpenConfig} />
            <RightIconButton onClick={() => setIsHelpOpen(true)} color='#7fcce3a9' bottom='80px' icon={<FiHelpCircle />} />
            <ConfigPopup isOpen={openConfig} onClose={handleConfigClose} user={user} />
            {isHelpOpen && <HelpPopup isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />}
            {children}
        </>
    )

}

export default memo(FlowWrapper);