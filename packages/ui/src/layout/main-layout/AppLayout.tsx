import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Flow from "../../components/Flow";
import { FiSun, FiMoon, FiMail } from "react-icons/fi";
import { Node, Edge } from "reactflow";
import { ThemeContext } from "../../providers/ThemeProvider";
import { darken, em, lighten } from "polished";
import { useTranslation } from "react-i18next";
import { FaEye, FaSitemap, FaToolbox } from "react-icons/fa";
import {
  convertFlowToJson,
  convertJsonToFlow,
  findParents,
  formatFlow,
  isCompatibleConfigVersion,
  migrateConfig,
  nodesTopologicalSort,
} from "../../utils/flowUtils";
import {
  toastCustomIconInfoMessage,
  toastErrorMessage,
  toastFastInfoMessage,
  toastInfoMessage,
} from "../../utils/toastUtils";
import ButtonRunAll from "../../components/buttons/ButtonRunAll";
import { FlowEvent, SocketContext } from "../../providers/SocketProvider";
import LoginButton from "../../components/login/LoginButton";
import FlowWrapper from "./wrapper/FlowWrapper";
import SmartView from "../../components/smart-view/SmartView";
import { Layout } from "../../components/smart-view/RenderLayout";
import EdgeTypeButton from "../../components/buttons/EdgeTypeButton";
import TabHeader from "./header/TabHeader";
import {
  createErrorMessageForMissingFields,
  getNodeInError,
} from "../../utils/flowChecker";

export interface FlowTab {
  nodes: Node[];
  edges: Edge[];
  layout?: Layout;
  metadata?: FlowMetadata;
}

interface FlowMetadata {
  version: string;
}

interface FlowManagerState {
  tabs: FlowTab[];
}

export type ApplicationMode = "flow" | "view";
export type ApplicationMenu = "template" | "config" | "help";

const FlowTabs = () => {
  const { t } = useTranslation("flow");

  const [flowTabs, setFlowTabs] = useState<FlowManagerState>({
    tabs: [{ nodes: [], edges: [] }],
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [showOnlyOutput, setShowOnlyOutput] = useState(false);
  const { dark, toggleTheme } = useContext(ThemeContext);
  const { emitEvent } = useContext(SocketContext);
  const [isRunning, setIsRunning] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [mode, setMode] = useState<ApplicationMode>("flow");
  const [selectedEdgeType, setSelectedEdgeType] = useState("default");
  const useAuth = import.meta.env.VITE_APP_USE_AUTH === "true";

  const handleToggleOutput = () => {
    setShowOnlyOutput(!showOnlyOutput);
  };

  useEffect(() => {
    const savedFlowTabsJson = localStorage.getItem("flowTabs");
    const savedCurrentTab = localStorage.getItem("currentTab");
    if (savedFlowTabsJson) {
      const savedFlowTabs = JSON.parse(savedFlowTabsJson) as FlowManagerState;
      // savedFlowTabs.tabs.forEach((tab) => {
      //   if (!isCompatibleConfigVersion(tab.metadata?.version)) {
      //     migrateConfig(tab)
      //   }
      // })
      setFlowTabs(savedFlowTabs);
      setCurrentTab(parseInt(savedCurrentTab || "0"));
      setRefresh(true);
    }
  }, []);

  useEffect(() => {
    if (flowTabs.tabs.length >= 1 && flowTabs.tabs[0].nodes.length !== 0) {
      localStorage.setItem("flowTabs", JSON.stringify(flowTabs));
    }
  }, [flowTabs]);

  useEffect(() => {
    localStorage.setItem("currentTab", currentTab.toString());
  }, [currentTab]);

  useEffect(() => {
    const loadIntroFile = async () => {
      const firstVisit = localStorage.getItem("firstVisit") !== "false";
      const savedFlowTabs = localStorage.getItem("flowTabs");

      if (firstVisit && !savedFlowTabs) {
        try {
          const response = await fetch("/samples/intro.json");
          if (!response.ok) {
            throw new Error("Failed to fetch intro file");
          }
          const jsonData = await response.json();
          const newFlowTab: FlowManagerState = { tabs: [] };
          newFlowTab.tabs.push(convertJsonToFlow(jsonData));

          setFlowTabs(newFlowTab);
          setRefresh(true);

          localStorage.setItem("firstVisit", "false");
        } catch (error) {
          console.error("Cannot load sample file :", error);
        }
      }
    };

    loadIntroFile();
  }, []);

  const addFlowTab = () => {
    const newFlowTab = { ...flowTabs };
    newFlowTab.tabs.push({
      nodes: [],
      edges: [],
      metadata: { version: "1.0.0" },
    });
    setFlowTabs(newFlowTab);
  };

  const handleFlowChange = (nodes: Node[], edges: Edge[]) => {
    const updatedTabs = flowTabs.tabs.map((tab, index) => {
      if (index === currentTab) {
        return { ...tab, nodes, edges };
      }
      return tab;
    });
    const updatedFlowTabs = { ...flowTabs, tabs: updatedTabs };
    setFlowTabs(updatedFlowTabs);
  };

  const handleLayoutChange = (layout: Layout) => {
    const updatedTabs = flowTabs.tabs.map((tab, index) => {
      if (index === currentTab) {
        return { ...tab, layout };
      }
      return tab;
    });
    const updatedFlowTabs = { ...flowTabs, tabs: updatedTabs };
    setFlowTabs(updatedFlowTabs);
  };

  const handleRunAllCurrentFlow = () => {
    const nodes = flowTabs.tabs[currentTab].nodes;
    const edges = flowTabs.tabs[currentTab].edges;

    const nodesSorted = nodesTopologicalSort(nodes, edges);
    const flowFile = convertFlowToJson(nodesSorted, edges, false, true);

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
      },
    };
    const success = emitEvent(event);

    setIsRunning(success);
  };

  const handleChangeRun = (runStatus: boolean) => {
    setIsRunning(runStatus);
  };

  const handleChangeTab = (index: number) => {
    if (!isRunning) {
      setCurrentTab(index);
    } else {
      toastFastInfoMessage(t("CannotChangeTabWhileRunning"));
    }
  };

  const handleClickProfile = () => {
    setOpenConfig(true);
  };

  const handleChangeMode = (mode: ApplicationMode) => {
    setMode(mode);
  };

  const handleDeleteFlow = (index: number) => {
    if (flowTabs.tabs.length === 1) {
      toastInfoMessage(t("CannotDeleteLastFlow"));
      return;
    }

    let updatedTabs = structuredClone(flowTabs.tabs);
    updatedTabs = updatedTabs.filter((_: FlowTab, i: number) => i !== index);

    const updatedFlowTabs = { ...flowTabs, tabs: updatedTabs };
    setFlowTabs(updatedFlowTabs);
    setCurrentTab(index - 1 > 0 ? index - 1 : 0);
    setRefresh(!refresh);
  };

  const handleFormatFlow = () => {
    const nodes = flowTabs.tabs[currentTab].nodes;
    const edges = flowTabs.tabs[currentTab].edges;

    const nodesFormatted = formatFlow(nodes, edges);

    handleFlowChange(nodesFormatted, edges);
    setRefresh(!refresh);
  };

  const handleAddNewFlow = (flowData: any) => {
    flowTabs.tabs.push(flowData);
    setCurrentTab(flowTabs.tabs.length - 1);
  };

  const handleChangeTabName = (index: number, name: string) => {
    const updatedTabs = flowTabs.tabs.map((tab, i) =>
      i === index ? { ...tab, name } : tab,
    );
    const updatedFlowTabs = { ...flowTabs, tabs: updatedTabs };
    setFlowTabs(updatedFlowTabs);
  };

  return (
    <FlowManagerContainer className="relative flex h-screen flex-col">
      <TabHeader
        currentTab={currentTab}
        tabs={flowTabs.tabs}
        onDeleteTab={handleDeleteFlow}
        onAddFlowTab={addFlowTab}
        onChangeTab={handleChangeTab}
        onChangeTabName={handleChangeTabName}
        tabPrefix={t("Flow")}
      >
        <div className="ml-auto flex flex-row items-center space-x-2 ">
          {mode === "flow" && (
            <>
              <div className="hidden h-auto w-6 md:flex">
                <EdgeTypeButton
                  edgeType={selectedEdgeType}
                  onChangeEdgeType={(newEdgeType) =>
                    setSelectedEdgeType(newEdgeType)
                  }
                />
              </div>

              <FaSitemap
                className="hidden -rotate-90 text-slate-400 hover:text-slate-50 md:flex"
                onClick={handleFormatFlow}
              />

              <FaEye
                className={` ${showOnlyOutput ? "rounded-2xl text-green-400 ring-1 ring-green-400/50 hover:text-green-200" : "text-slate-400 hover:text-slate-50 "}`}
                onClick={handleToggleOutput}
              />
            </>
          )}

          {/* {mode === "view" && (
            <FaToolbox
              className="hidden  text-slate-400 hover:text-slate-50 md:flex"
              onClick={handleFormatFlow}
            />
          )} */}
          <div className="hidden h-6 border-l-2 border-l-slate-500/50 pl-2 md:flex"></div>
          <div className="pr-2">
            <ButtonRunAll
              onClick={handleRunAllCurrentFlow}
              isRunning={isRunning}
            />
          </div>
        </div>
      </TabHeader>

      <FlowWrapper
        mode={mode}
        openConfig={openConfig}
        onCloseConfig={() => setOpenConfig(false)}
        onOpenConfig={() => setOpenConfig(true)}
        onChangeMode={handleChangeMode}
        onAddNewFlow={handleAddNewFlow}
      >
        {mode === "flow" && (
          <Flow
            key={`flow-${currentTab}-${refresh}`}
            nodes={flowTabs.tabs[currentTab].nodes}
            edges={flowTabs.tabs[currentTab].edges}
            onFlowChange={handleFlowChange}
            showOnlyOutput={showOnlyOutput}
            isRunning={isRunning}
            onRunChange={handleChangeRun}
            selectedEdgeType={selectedEdgeType}
          />
        )}
        {mode === "view" && (
          <SmartView
            key={`smartview-${currentTab}-${refresh}`}
            nodes={flowTabs.tabs[currentTab].nodes}
            edges={flowTabs.tabs[currentTab].edges}
            tabLayout={flowTabs.tabs[currentTab].layout}
            isRunning={isRunning}
            onLayoutChange={handleLayoutChange}
            onFlowChange={handleFlowChange}
            onRunChange={handleChangeRun}
          />
        )}
      </FlowWrapper>
    </FlowManagerContainer>
  );
};

const FlowManagerContainer = styled.div``;

export default FlowTabs;
