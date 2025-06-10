import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useImperativeHandle,
  Ref,
  forwardRef,
} from "react";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import SideBar from "./bars/Sidebar";
import { NodeProvider } from "../providers/NodeProvider";
import { MiniMapStyled, ReactFlowStyled } from "./nodes/Node.styles";
import UserMessagePopup, {
  MessageType,
  UserMessage,
} from "./popups/UserMessagePopup";
import { getAllNodeWithEaseOut } from "../utils/mappings";
import { useDrop } from "react-dnd";
import { useSocketListeners } from "../hooks/useFlowSocketListeners";
import ButtonEdge from "./edges/buttonEdge";
import { createNewNode } from "../utils/nodeUtils";
import {
  FlowOnCurrentNodeRunningEventData,
  FlowOnErrorEventData,
  FlowOnProgressEventData,
} from "../sockets/flowEventTypes";
import { useVisibility } from "../providers/VisibilityProvider";
import { FlowMetadata } from "../layout/main-layout/AppLayout";

export interface FlowProps {
  nodes: Node[];
  edges: Edge[];
  metadata: FlowMetadata;
  onFlowChange: (nodes: Node[], edges: Edge[], metadata: FlowMetadata) => void;
  onUpdateMetadata?: (metadata: FlowMetadata) => void;
  showOnlyOutput?: boolean;
  isRunning: boolean;
  onRunChange: (isRunning: boolean) => void;
  onLoaded: () => void;
}

const Flow = forwardRef((props: FlowProps, ref) => {
  const reactFlowWrapper = useRef(null);

  function getAllEdgeTypes() {
    return { buttonedge: ButtonEdge };
  }
  const nodeTypes = useMemo(() => getAllNodeWithEaseOut(), []);
  const edgeTypes = useMemo(() => getAllEdgeTypes(), []);

  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance | undefined
  >(undefined);
  const [nodes, setNodes] = useState<Node[]>(props.nodes);
  const [edges, setEdges] = useState<Edge[]>(props.edges);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [currentUserMessage, setCurrentUserMessage] = useState<UserMessage>({
    content: "",
  });
  const [currentNodesRunning, setCurrentNodesRunning] = useState<string[]>([]);
  const [errorCount, setErrorCount] = useState<number>(0);

  const { getElement } = useVisibility();
  const minimap = getElement("minimap");

  useEffect(() => {
    const areNodesRunning = currentNodesRunning.length > 0;
    if (props.isRunning !== areNodesRunning) {
      props.onRunChange(areNodesRunning);
    }
  }, [currentNodesRunning]);

  const [{ isOver }, dropRef] = useDrop({
    accept: "NODE",
    drop: (item, monitor) => {
      onDrop(item, monitor);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const onInit = (reactFlowInstance: ReactFlowInstance) => {
    setReactFlowInstance(reactFlowInstance);
  };

  const addNode = (type: string, data?: any) => {
    const reactFlowBounds = (
      reactFlowWrapper.current as any
    ).getBoundingClientRect();

    const additionnalData = data?.additionnalData;
    const additionnalConfig = data?.additionnalConfig;

    if (typeof type === "undefined" || !type) {
      return;
    }

    const position = (reactFlowInstance as any).project({
      x: reactFlowBounds.width / 2 - 100,
      y: reactFlowBounds.height / 2 - 100,
    });

    const newNode = createNewNode(
      type,
      position,
      additionnalData,
      additionnalConfig,
    );

    setNodes((nds) => nds.concat(newNode));
  };

  useImperativeHandle(ref, () => ({
    addNode,
  }));

  useSocketListeners<
    FlowOnProgressEventData,
    FlowOnErrorEventData,
    FlowOnProgressEventData
  >(onProgress, onError, () => {}, onCurrentNodeRunning);

  function onProgress(data: FlowOnProgressEventData) {
    const nodeToUpdate = data.instanceName;
    const output = data.output;

    setCurrentNodesRunning((previous) => {
      return previous.filter((node) => node != nodeToUpdate);
    });

    if (nodeToUpdate) {
      setNodes((prevNodes) => {
        return [
          ...prevNodes.map((node: Node) => {
            if (node.data.name == nodeToUpdate) {
              node.data = {
                ...node.data,
                outputData: output,
                lastRun: new Date(),
                isDone: data.isDone,
              };
            }

            return node;
          }),
        ];
      });
    }
  }

  function onError(data: FlowOnErrorEventData) {
    setCurrentNodesRunning((previous) => {
      return previous.filter((node) => node != data.instanceName);
    });
    setCurrentUserMessage({
      content: data.error,
      nodeId: data.instanceName ?? data.nodeName,
      type: MessageType.Error,
    });
    setErrorCount((prevErrorCount) => prevErrorCount + 1);
    setIsPopupOpen(true);
  }

  function onCurrentNodeRunning(data: FlowOnCurrentNodeRunningEventData) {
    setCurrentNodesRunning((previous) => {
      return [...previous, data.instanceName];
    });
  }

  useEffect(() => {
    if (props.onFlowChange) {
      props.onFlowChange(nodes, edges, props.metadata);
    }
  }, [nodes, edges]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) => {
        if (
          isHandleAlreadyTargeted(connection, eds) ||
          isSameNodeTargeted(connection)
        ) {
          return eds;
        }
        return addEdge(
          {
            ...connection,
            type: "buttonedge",
            markerEnd: "arrowClosed",
          },
          eds,
        );
      }),
    [setEdges],
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    if (!!event.dataTransfert) {
      event.dataTransfer.dropEffect = "move";
    }
  }, []);

  const onDrop = useCallback(
    (item: any, monitor?: any) => {
      if (
        !!reactFlowWrapper &&
        !!reactFlowInstance &&
        !!reactFlowWrapper.current
      ) {
        const reactFlowBounds = (
          reactFlowWrapper.current as any
        ).getBoundingClientRect();
        const type = item.nodeType;
        const additionnalData = item.additionnalData;
        const additionnalConfig = item.additionnalConfig;

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        const { x, y } = monitor.getClientOffset();

        const position = (reactFlowInstance as any).project({
          x: x - reactFlowBounds.left,
          y: y - reactFlowBounds.top,
        });

        const newNode = createNewNode(
          type,
          position,
          additionnalData,
          additionnalConfig,
        );
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance],
  );

  const isHandleAlreadyTargeted = (connection: Connection, eds: Edge[]) => {
    if (
      eds.filter(
        (edge) =>
          edge.targetHandle === connection.targetHandle &&
          edge.target === connection.target,
      ).length > 0
    ) {
      return true;
    }
    return false;
  };

  const isSameNodeTargeted = (connection: Connection) => {
    if (connection.source === connection.target) {
      return true;
    }
    return false;
  };

  const handlePopupClose = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  function handleChangeFlow(nodes: Node[], edges: Edge[]): void {
    setNodes(nodes);
    setEdges(edges);
  }

  const handleUpdateNodeData = (nodeId: string, data: any) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data };
      }
      return node;
    });
    setNodes(updatedNodes);
  };

  const handleUpdateNodes = (updatedNodes: Node[], updatesEdges: Edge[]) => {
    setNodes(updatedNodes);
    setEdges(updatesEdges);
  };

  return (
    <NodeProvider
      nodes={nodes}
      edges={edges}
      metadata={props.metadata}
      showOnlyOutput={props.showOnlyOutput}
      isRunning={props.isRunning}
      currentNodesRunning={currentNodesRunning}
      errorCount={errorCount}
      onUpdateNodeData={handleUpdateNodeData}
      onUpdateNodes={handleUpdateNodes}
    >
      <div className="h-full w-full" ref={dropRef}>
        <div className="reactflow-wrapper h-full w-full" ref={reactFlowWrapper}>
          <ReactFlowStyled
            nodes={nodes}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onTouchEnd={onDragOver}
            onInit={onInit}
            fitView
            fitViewOptions={{
              maxZoom: 0.5,
            }}
            minZoom={0.2}
            maxZoom={1.5}
            onLoad={props.onLoaded}
          >
            {minimap.isVisible && <MiniMapStyled style={{ right: "4vw" }} />}
          </ReactFlowStyled>
        </div>
        <SideBar nodes={nodes} edges={edges} onChangeFlow={handleChangeFlow} />
        <UserMessagePopup
          isOpen={isPopupOpen}
          onClose={handlePopupClose}
          message={currentUserMessage}
        />
      </div>
    </NodeProvider>
  );
});

export default Flow;
