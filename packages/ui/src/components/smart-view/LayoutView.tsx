import { useEffect, useRef, useState } from "react";
import { Node, Edge } from "reactflow";
import { NodeProvider } from "../../providers/NodeProvider";
import { useSocketListeners } from "../../hooks/useFlowSocketListeners";
import { toastInfoMessage } from "../../utils/toastUtils";
import {
  FlowOnCurrentNodeRunningEventData,
  FlowOnErrorEventData,
  FlowOnProgressEventData,
} from "../../sockets/flowEventTypes";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import NodePane from "./pane/NodePane";
import PaneWrapper from "./pane/PaneWrapper";
import {
  FlowMetadata,
  LayoutViewData,
} from "../../layout/main-layout/AppLayout";
import SmartViewActions from "./LayoutViewActions";
import { Modal } from "@mantine/core";
export type LayoutIndex = string | number;

export interface TextOptions {
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  color?: string;
  textAlign?: "left" | "center" | "right";
  isHeading?: boolean;
}

export interface BasicPane {
  nodeId?: string;
  fieldNames?: string[];
  text?: string;
  options?: TextOptions;
}

export type PaneDataState = {
  [key: string]: BasicPane;
};

interface SmartViewProps {
  tabLayout?: LayoutViewData;
  nodes: Node[];
  edges: Edge[];
  metadata: FlowMetadata;
  onFlowChange?: (nodes: Node[], edges: Edge[], metadata: FlowMetadata) => void;
  onLayoutChange: (layout: Layout[]) => void;
  onPaneDataChange: (data: PaneDataState) => void;
  isRunning: boolean;
  onRunChange: (isRunning: boolean) => void;
}

const initialLayout = [{ i: "1", x: 0, y: 0, w: 5, h: 10 }];

function LayoutView({
  tabLayout,
  nodes,
  edges,
  metadata,
  onFlowChange,
  onLayoutChange,
  onPaneDataChange,
  isRunning,
  onRunChange,
}: SmartViewProps) {
  useSocketListeners<
    FlowOnProgressEventData,
    FlowOnErrorEventData,
    FlowOnProgressEventData
  >(onProgress, onError, () => {}, onCurrentNodeRunning);
  const [currentNodesRunning, setCurrentNodesRunning] = useState<string[]>([]);

  const [width, setWidth] = useState(window.innerWidth);
  const [zoomedItem, setZoomedItem] = useState<BasicPane | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!tabLayout?.layout) {
      onLayoutChange(initialLayout);
    }
  });

  const layout = tabLayout?.layout || initialLayout;
  const paneData = tabLayout?.data || {};

  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  useEffect(() => {
    const areNodesRunning = currentNodesRunning.length > 0;
    if (isRunning !== areNodesRunning) {
      onRunChange(areNodesRunning);
    }
  }, [currentNodesRunning]);

  function onProgress(data: FlowOnProgressEventData) {
    const nodeToUpdate = data.instanceName;
    const output = data.output;

    setCurrentNodesRunning((previous) => {
      return previous.filter((node) => node != nodeToUpdate);
    });

    if (nodeToUpdate && output) {
      const nodesUpdated = [...nodesRef.current];
      nodesUpdated.map((node: Node) => {
        if (node.data.name == nodeToUpdate) {
          node.data = { ...node.data, outputData: output, lastRun: new Date() };
        }

        return node;
      });
      if (onFlowChange) {
        onFlowChange(nodesUpdated, edges, metadata);
      }
    }
  }

  function onError(data: FlowOnErrorEventData) {
    setCurrentNodesRunning((previous) => {
      return previous.filter((node) => node != data.instanceName);
    });
    toastInfoMessage("Error");
  }

  function onCurrentNodeRunning(data: FlowOnCurrentNodeRunningEventData) {
    setCurrentNodesRunning((previous) => {
      return [...previous, data.instanceName];
    });
  }

  function handleAttachNode(
    paneId: LayoutIndex,
    nodeId?: string,
    fieldNames?: string[],
  ) {
    onPaneDataChange({
      ...paneData,
      [paneId]: {
        nodeId: nodeId,
        fieldNames: fieldNames,
      },
    });
  }

  function handleAttachText(
    paneId: LayoutIndex,
    text?: string,
    options?: TextOptions,
  ) {
    onPaneDataChange({
      ...paneData,
      [paneId]: {
        text: text,
        options: options,
      },
    });
  }

  function handleDeletePane(index: LayoutIndex) {
    if (!!paneData[index]?.nodeId) {
      const newPaneData = { ...paneData };
      delete newPaneData[index];

      onPaneDataChange(newPaneData);
    } else {
      onLayoutChange(
        layout.filter((item) => {
          return item.i !== index;
        }),
      );
    }
  }

  function handleUpdateNodes(nodesUpdated: Node[], edgesUpdated: Edge[]): void {
    onFlowChange?.(nodesUpdated, edgesUpdated, metadata);
  }

  function handleUpdateNodeData(nodeId: string, data: any): void {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data };
      }
      return node;
    });
    onFlowChange?.(updatedNodes, edges, metadata);
  }

  const handleLayoutChange = (newLayout: Layout[]) => {
    onLayoutChange(newLayout);
  };

  const addNewBlock = () => {
    const maxValue =
      layout.length > 0 ? Math.max(...layout.map((item) => +item.i)) : 0;
    const newId = maxValue + 1;
    const newBlock: Layout = {
      i: "" + newId,
      x: 0,
      y: Infinity,
      w: 5,
      h: 5,
    };
    onLayoutChange([...layout, newBlock]);
  };

  function toggleLock() {
    setEnabled(!enabled);
  }

  function handleSetZoomedItem(pane: BasicPane) {
    setZoomedItem(pane);
  }

  return (
    <div className="smart-view h-auto w-full bg-app-dark-gradient">
      <div className="ml-10 min-h-screen">
        <NodeProvider
          nodes={nodes}
          edges={edges}
          showOnlyOutput={false}
          isRunning={isRunning}
          errorCount={0}
          currentNodesRunning={currentNodesRunning}
          onUpdateNodeData={handleUpdateNodeData}
          onUpdateNodes={handleUpdateNodes}
        >
          <div className="flex justify-center">
            <div className="w-[80%]">
              <GridLayout
                className={`layout`}
                layout={layout}
                cols={12}
                rowHeight={30}
                width={width * 0.8}
                onLayoutChange={handleLayoutChange}
                isDraggable={enabled}
                isResizable={enabled}
                isDroppable={false}
              >
                {layout.map((item) => (
                  <div key={item.i} className={`grid-item`}>
                    <PaneWrapper
                      index={item.i}
                      paneData={paneData[item.i] ?? {}}
                      onDelete={handleDeletePane}
                      onClickName={() => handleSetZoomedItem(paneData[item.i])}
                      isEnabled={enabled}
                    >
                      <NodePane
                        index={item.i}
                        paneData={paneData[item.i] ?? {}}
                        onAttachNode={handleAttachNode}
                        onAttachText={handleAttachText}
                        isEnabled={enabled}
                      />
                    </PaneWrapper>
                  </div>
                ))}
              </GridLayout>
            </div>
          </div>

          {zoomedItem && (
            <Modal
              opened={!!zoomedItem}
              onClose={() => setZoomedItem(undefined)}
              withCloseButton={true}
              size="auto"
              centered
            >
              <NodePane paneData={zoomedItem} isEnabled={false} />
            </Modal>
          )}
        </NodeProvider>
        <SmartViewActions
          onAddPane={addNewBlock}
          toggleLockView={toggleLock}
          viewLocked={!enabled}
        />
      </div>
    </div>
  );
}

export default LayoutView;
