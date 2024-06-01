import React, { createContext, useContext, useState, ReactNode } from "react";

export type VisibilityElement =
  | "sidebar"
  | "minimap"
  | "dragAndDropSidebar"
  | "configPopup";

export type SidepaneTab = "json" | "topological" | "current_node";
export type ConfigTab = "user" | "display";

export interface VisibilityContextState {
  [key: string]: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    toggle: () => void;
  };
}

interface VisibilityContextType {
  getElement: (key: VisibilityElement) => VisibilityContextState[string];
  sidepaneActiveTab: SidepaneTab;
  setSidepaneActiveTab: (tab: SidepaneTab) => void;
  configActiveTab: ConfigTab;
  setConfigActiveTab: (tab: ConfigTab) => void;
}

export const VisibilityContext = createContext<
  VisibilityContextType | undefined
>(undefined);

interface VisibilityProviderProps {
  children: ReactNode;
}

export const VisibilityProvider: React.FC<VisibilityProviderProps> = ({
  children,
}) => {
  const [visibilityState, setVisibilityState] =
    useState<VisibilityContextState>({
      sidebar: {
        isVisible: false,
        show: () => setVisibility("sidebar", true),
        hide: () => setVisibility("sidebar", false),
        toggle: () => toggleVisibility("sidebar"),
      },
      minimap: {
        isVisible: true,
        show: () => setVisibility("minimap", true),
        hide: () => setVisibility("minimap", false),
        toggle: () => toggleVisibility("minimap"),
      },
      dragAndDropSidebar: {
        isVisible: true,
        show: () => setVisibility("dragAndDropSidebar", true),
        hide: () => setVisibility("dragAndDropSidebar", false),
        toggle: () => toggleVisibility("dragAndDropSidebar"),
      },
      configPopup: {
        isVisible: false,
        show: () => setVisibility("configPopup", true),
        hide: () => setVisibility("configPopup", false),
        toggle: () => toggleVisibility("configPopup"),
      },
    });

  const [sidepaneActiveTab, setSidepaneActiveTab] =
    useState<SidepaneTab>("json");

  const [configActiveTab, setConfigActiveTab] = useState<ConfigTab>("user");

  const setVisibility = (key: VisibilityElement, isVisible: boolean) => {
    setVisibilityState((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        isVisible,
      },
    }));
  };

  const toggleVisibility = (key: VisibilityElement) => {
    setVisibilityState((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        isVisible: !prevState[key].isVisible,
      },
    }));
  };

  const getElement = (key: VisibilityElement) => {
    return visibilityState[key];
  };

  const value = {
    getElement: getElement,
    sidepaneActiveTab: sidepaneActiveTab,
    setSidepaneActiveTab: setSidepaneActiveTab,
    configActiveTab: configActiveTab,
    setConfigActiveTab: setConfigActiveTab,
  };

  return (
    <VisibilityContext.Provider value={value}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = (): VisibilityContextType => {
  const context = useContext(VisibilityContext);
  if (context === undefined) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return context;
};
