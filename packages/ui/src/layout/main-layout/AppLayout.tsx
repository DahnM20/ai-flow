import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Flow from "../../components/Flow";
import { Node, Edge } from "reactflow";
import { useTranslation } from "react-i18next";
import {
  convertFlowToJson,
  formatFlow,
  nodesTopologicalSort,
} from "../../utils/flowUtils";
import {
  toastErrorMessage,
  toastFastInfoMessage,
  toastInfoMessage,
} from "../../utils/toastUtils";
import ButtonRunAll from "../../components/buttons/ButtonRunAll";
import { FlowEvent, SocketContext } from "../../providers/SocketProvider";
import FlowWrapper from "./wrapper/FlowWrapper";
import TabHeader from "./header/TabHeader";
import {
  createErrorMessageForMissingFields,
  getNodeInError,
} from "../../utils/flowChecker";
import { useVisibility } from "../../providers/VisibilityProvider";
import { FlowDataProvider } from "../../providers/FlowDataProvider";
import {
  getCurrentTabIndex,
  saveCurrentTabIndex,
  saveTabsLocally,
} from "../../services/tabStorage";
import { useLoading } from "../../hooks/useLoading";

export interface FlowTab {
  nodes: Node[];
  edges: Edge[];
  metadata?: FlowMetadata;
}

export interface FlowMetadata {
  id?: string;
  name?: string;
  saveFlow?: boolean;
  version?: string;
  hostUrl?: string;
  lastSave?: number;
  isPublic?: boolean;
}

export interface FlowManagerState {
  tabs: FlowTab[];
}

export interface FlowTabsProps {
  tabs: FlowTab[];
}

export type ApplicationMode = "flow";
export type ApplicationMenu = "template" | "config" | "help";

const FlowTabs = ({ tabs }: FlowTabsProps) => {
  const { t } = useTranslation("flow");

  const [flowTabs, setFlowTabs] = useState<FlowManagerState>({
    tabs: tabs,
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [showOnlyOutput, setShowOnlyOutput] = useState(false);
  const { emitEvent, connect } = useContext(SocketContext);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<ApplicationMode>("flow");
  const [selectedEdgeType, setSelectedEdgeType] = useState("default");
  const useAuth = import.meta.env.VITE_APP_USE_AUTH === "true";
  const { getElement } = useVisibility();
  const [loading, startLoadingWith] = useLoading();
  const configPopup = getElement("configPopup");

  const currentTabRef = useRef(currentTab);
  const flowTabsRef = useRef(flowTabs);

  useEffect(() => {
    connect();
  });

  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => {
    flowTabsRef.current = flowTabs;
  }, [flowTabs]);

  useEffect(() => {
    const init = async () => {
      const savedCurrentTab = getCurrentTabIndex();
      await handleChangeTab(parseInt(savedCurrentTab || "0"));
      setRefresh((prev) => !prev);
    };
    init();
  }, []);

  useEffect(() => {
    saveTabsLocally(flowTabs.tabs);
  }, [flowTabs]);

  useEffect(() => {
    saveCurrentTabIndex(currentTab);
  }, [currentTab]);

  const addNewFlowTab = () => {
    setFlowTabs((prevFlowTabs) => {
      const newFlowTab = { ...prevFlowTabs };
      newFlowTab.tabs.push({
        nodes: [],
        edges: [],
        metadata: { version: "1.0.0" },
      });
      return newFlowTab;
    });
  };

  const handleFlowChange = (
    nodes: Node[],
    edges: Edge[],
    metadata?: FlowMetadata,
  ) => {
    setFlowTabs((prevFlowTabs) => {
      const updatedTabs = prevFlowTabs.tabs.map((tab, index) => {
        if (index === currentTab) {
          return {
            ...tab,
            nodes,
            edges,
            metadata: { ...tab.metadata, ...metadata },
          };
        }
        return tab;
      });
      return { ...prevFlowTabs, tabs: updatedTabs };
    });
  };

  const handleMetadataChange = (metadata: FlowMetadata) => {
    setFlowTabs((prevFlowTabs) => {
      const updatedTabs = prevFlowTabs.tabs.map((tab, index) => {
        if (index === currentTab) {
          return {
            ...tab,
            metadata: { ...tab.metadata, ...metadata },
          };
        }
        return tab;
      });
      return { ...prevFlowTabs, tabs: updatedTabs };
    });
  };

  const handleRunAllCurrentFlow = () => {
    const nodes = flowTabs.tabs[currentTab].nodes;
    const edges = flowTabs.tabs[currentTab].edges;

    if (nodes.length === 0) {
      toastFastInfoMessage(t("NoNodesToRun"));
      return;
    }

    const nodesSorted = nodesTopologicalSort(nodes, edges);
    const flowFile = convertFlowToJson(nodesSorted, edges, true, true);

    const nodesInError = getNodeInError(flowFile, nodesSorted);

    if (nodesInError.length > 0) {
      let errorMessage = createErrorMessageForMissingFields(nodesInError, t);
      toastErrorMessage(errorMessage);
      setFlowTabs({ ...flowTabs });
      return;
    }

    const event: FlowEvent = {
      name: "process_file",
      data: {
        jsonFile: JSON.stringify(flowFile),
        metadata: flowTabs.tabs[currentTab].metadata,
      },
    };
    const success = emitEvent(event);

    setIsRunning(success);
  };

  const handleChangeRun = (runStatus: boolean) => {
    setIsRunning(runStatus);
  };

  const handleChangeTab = useCallback(
    async (index: number) => {
      if (!isRunning) {
        setCurrentTab(index);
      } else {
        toastFastInfoMessage(t("CannotChangeTabWhileRunning"));
      }
    },
    [isRunning],
  );

  const handleChangeMode = (mode: ApplicationMode) => {
    setMode(mode);
  };

  const handleDeleteFlow = async (index: number) => {
    if (flowTabsRef.current.tabs.length === 1) {
      toastInfoMessage(t("CannotDeleteLastFlow"));
      return;
    }

    setFlowTabs((prev) => {
      let updatedTabs = structuredClone(prev.tabs);
      updatedTabs = updatedTabs.filter((_: FlowTab, i: number) => i !== index);
      const updatedFlowTabs = { ...prev, tabs: updatedTabs };
      return updatedFlowTabs;
    });

    setCurrentTab(index - 1 > 0 ? index - 1 : 0);
    setRefresh((prev) => !prev);
  };

  const handleAddNewFlow = (flowData: any) => {
    setFlowTabs((prevFlowTabs) => {
      const newFlowTab = { ...prevFlowTabs };
      newFlowTab.tabs.push(flowData);
      return newFlowTab;
    });
    setCurrentTab(flowTabs.tabs.length - 1);
  };

  const handleChangeTabName = (index: number, name: string) => {
    setFlowTabs((prevFlowTabs) => {
      const updatedTabs = prevFlowTabs.tabs.map((tab, i) =>
        i === index
          ? {
              ...tab,
              metadata: {
                ...tab.metadata,
                name,
              },
            }
          : tab,
      );
      return { ...prevFlowTabs, tabs: updatedTabs };
    });
  };

  return (
    <div className="relative flex h-screen flex-col">
      <TabHeader
        currentTab={currentTab}
        tabs={flowTabs.tabs}
        onDeleteTab={handleDeleteFlow}
        onAddFlowTab={addNewFlowTab}
        onChangeTab={handleChangeTab}
        onChangeTabName={handleChangeTabName}
        tabPrefix={t("Flow")}
      >
        <div className="ml-auto flex flex-row items-center space-x-2  ">
          <div className="mr-5">
            <ButtonRunAll
              onClick={handleRunAllCurrentFlow}
              isRunning={isRunning}
            />
          </div>
        </div>
      </TabHeader>

      <FlowDataProvider
        flowTab={flowTabs.tabs[currentTab]}
        onFlowChange={handleFlowChange}
      >
        <FlowWrapper
          key={`flow-${currentTab}`}
          mode={mode}
          onChangeMode={handleChangeMode}
          onAddNewFlow={handleAddNewFlow}
        >
          {mode === "flow" && (
            <Flow
              key={`flow-${currentTab}-${refresh}`}
              nodes={flowTabs.tabs[currentTab]?.nodes ?? []}
              edges={flowTabs.tabs[currentTab]?.edges ?? []}
              metadata={flowTabs.tabs[currentTab]?.metadata ?? {}}
              onFlowChange={handleFlowChange}
              onUpdateMetadata={handleMetadataChange}
              showOnlyOutput={showOnlyOutput}
              isRunning={isRunning}
              onRunChange={handleChangeRun}
              selectedEdgeType={selectedEdgeType}
            />
          )}
        </FlowWrapper>
      </FlowDataProvider>
    </div>
  );
};

export default FlowTabs;
