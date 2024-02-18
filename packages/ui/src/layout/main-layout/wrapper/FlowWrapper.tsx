import { ReactNode, memo, useCallback, useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import ConfigPopup from "../../../components/popups/config-popup/ConfigPopup";
import HelpPopup from "../../../components/popups/HelpPopup";
import DnDSidebar from "../../../components/bars/dnd-sidebar/DnDSidebar";
import RightIconButton from "../../../components/buttons/ConfigurationButton";
import ModeBar from "../sidebar/ModeBar";
import { ApplicationMenu, ApplicationMode } from "../AppLayout";
import TemplatePopup from "../../../components/popups/TemplatePopup";

interface FlowWrapperProps {
  children?: ReactNode;
  mode: ApplicationMode;
  openConfig: boolean;
  onCloseConfig: () => void;
  onOpenConfig: () => void;
  onChangeMode: (newMode: ApplicationMode) => void;
  onAddNewFlow: (flowData: any) => void;
}

type MenuStateType = {
  [key in ApplicationMenu]: boolean;
};

function FlowWrapper({
  openConfig,
  mode,
  onCloseConfig,
  onOpenConfig,
  onChangeMode,
  onAddNewFlow,
  children,
}: FlowWrapperProps) {
  const [menuState, setMenuState] = useState<MenuStateType>(
    {} as MenuStateType,
  );

  const handleConfigClose = useCallback(() => {
    onCloseConfig();
  }, []);

  const handleOpenConfig = useCallback(() => {
    onOpenConfig();
  }, []);

  const handleMenuChange = useCallback((menu: ApplicationMenu) => {
    menuState[menu] = !menuState[menu];
    setMenuState({ ...menuState });
  }, []);

  return (
    <>
      <div
        className="fixed left-0 
                          z-10
                          flex
                          h-full
                          flex-row
                          pt-16"
      >
        <ModeBar
          currentMode={mode}
          onChangeMode={onChangeMode}
          onOpenMenu={handleMenuChange}
        />
        {mode === "flow" && <DnDSidebar />}
      </div>
      <RightIconButton onClick={handleOpenConfig} />
      <RightIconButton
        onClick={() => handleMenuChange("help")}
        color="#7fcce38f"
        bottom="80px"
        icon={<FiHelpCircle />}
      />
      <ConfigPopup isOpen={openConfig} onClose={handleConfigClose} />
      <HelpPopup
        isOpen={menuState["help"]}
        onClose={() => handleMenuChange("help")}
      />
      <TemplatePopup
        isOpen={menuState["template"]}
        onValidate={onAddNewFlow}
        onClose={() => handleMenuChange("template")}
      />
      {children}
    </>
  );
}

export default memo(FlowWrapper);
