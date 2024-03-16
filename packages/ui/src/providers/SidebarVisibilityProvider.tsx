import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarVisibilityContextType {
  isSidebarVisible: boolean;
  showSidebar: () => void;
  hideSidebar: () => void;
  toggleSidebar: () => void;
}

export const SidebarVisibilityContext = createContext<
  SidebarVisibilityContextType | undefined
>(undefined);

interface SidebarVisibilityProviderProps {
  children: ReactNode;
}

export const SidebarVisibilityProvider: React.FC<
  SidebarVisibilityProviderProps
> = ({ children }) => {
  const [isSidebarVisible, setSidebarVisibility] = useState<boolean>(true);

  const value = {
    isSidebarVisible,
    showSidebar: () => setSidebarVisibility(true),
    hideSidebar: () => setSidebarVisibility(false),
    toggleSidebar: () => setSidebarVisibility((prev) => !prev),
  };

  return (
    <SidebarVisibilityContext.Provider value={value}>
      {children}
    </SidebarVisibilityContext.Provider>
  );
};

export const useSidebarVisibility = (): SidebarVisibilityContextType => {
  const context = useContext(SidebarVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarVisibility must be used within a SidebarVisibilityProvider",
    );
  }
  return context;
};
