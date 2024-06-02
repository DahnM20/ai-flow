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
import { LayoutViewData } from "../../layout/main-layout/AppLayout";
export type LayoutIndex = string | number;

export interface TextOptions {
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  color?: string;
  textAlign?: "left" | "center" | "right";
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
  onFlowChange?: (nodes: Node[], edges: Edge[]) => void;
  onLayoutChange: (layout: Layout[]) => void;
  onPaneDataChange: (data: PaneDataState) => void;
  isRunning: boolean;
  onRunChange: (isRunning: boolean) => void;
}

const initialLayout = [{ i: "1", x: 0, y: 0, w: 5, h: 10 }];

function SmartView({
  tabLayout,
  nodes,
  edges,
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
        onFlowChange(nodesUpdated, edges);
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
    onFlowChange?.(nodesUpdated, edgesUpdated);
  }

  function handleUpdateNodeData(nodeId: string, data: any): void {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data };
      }
      return node;
    });
    onFlowChange?.(updatedNodes, edges);
  }

  const handleLayoutChange = (newLayout: Layout[]) => {
    onLayoutChange(newLayout);
  };

  const addNewBlock = () => {
    const maxValue = Math.max(...layout.map((item) => +item.i));
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

  function enableGrid() {
    setEnabled(true);
  }
  function disableGrid() {
    setEnabled(false);
  }

  return (
    <div className="smart-view h-full w-full">
      {/* <button onClick={addNewBlock}>Add Block</button> */}
      <div className="ml-10 h-full">
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
          <GridLayout
            className={`layout z-0`}
            layout={layout}
            cols={12}
            rowHeight={30}
            width={width}
            onLayoutChange={handleLayoutChange}
          >
            {layout.map((item) => (
              <div
                key={item.i}
                className={`grid-item flex items-center justify-center rounded-md ${!paneData[item.i] ? "bg-zinc-800" : "bg-zinc-800/20"}`}
              >
                <PaneWrapper
                  index={item.i}
                  name={paneData[item.i]?.nodeId}
                  onDelete={handleDeletePane}
                  showTools={true}
                >
                  <NodePane
                    index={item.i}
                    paneData={paneData[item.i] ?? {}}
                    onAttachNode={handleAttachNode}
                    onAttachText={handleAttachText}
                    onOpenPopup={disableGrid}
                  />
                </PaneWrapper>
              </div>
            ))}
          </GridLayout>
        </NodeProvider>
      </div>
    </div>
  );
}

export default SmartView;
