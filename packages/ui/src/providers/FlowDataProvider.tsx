import React, { createContext, useContext, useState, ReactNode } from "react";
import { FlowMetadata, FlowTab } from "../layout/main-layout/AppLayout";
import { Edge, Node } from "reactflow";

interface FlowDataContextType {
  getCurrentTab: () => FlowTab;
  updateCurrentTabMetadata: (metadata: FlowMetadata) => void;
}

export const FlowDataContext = createContext<FlowDataContextType | undefined>(
  undefined,
);

interface FlowDataProviderProps {
  children: ReactNode;
  flowTab: FlowTab;
  onFlowChange: (nodes: Node[], edges: Edge[], metadata?: FlowMetadata) => void;
}

export const FlowDataProvider: React.FC<FlowDataProviderProps> = ({
  children,
  flowTab,
  onFlowChange,
}) => {
  function getCurrentTab() {
    return flowTab;
  }

  function updateCurrentTabMetadata(metadata: FlowMetadata) {
    onFlowChange(flowTab.nodes, flowTab.edges, metadata);
  }

  const value = {
    getCurrentTab: getCurrentTab,
    updateCurrentTabMetadata: updateCurrentTabMetadata,
  };

  return (
    <FlowDataContext.Provider value={value}>
      {children}
    </FlowDataContext.Provider>
  );
};

export const useFlowData = (): FlowDataContextType => {
  const context = useContext(FlowDataContext);
  if (context === undefined) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return context;
};
