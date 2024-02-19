import React, { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { NodeContext } from "../../providers/NodeProvider";
import { FaCopy, FaEraser } from "react-icons/fa";
import { createUniqNodeId } from "../../utils/nodeUtils";

type NodeWrapperProps = {
  children: React.ReactNode;
  nodeId: string;
};

const DUPLICATED_NODE_OFFSET = 100;

function NodeWrapper({ children, nodeId }: NodeWrapperProps) {
  const [showIcon, setShowIcon] = useState(false);
  const { onUpdateNodes, nodes, edges } = useContext(NodeContext);

  const currentNode = nodes.find((node) => node.id === nodeId);
  const currentNodeIsMissingFields =
    currentNode?.data?.missingFields?.length > 0;

  let hideIconTimeout: ReturnType<typeof setTimeout>;

  const showIconWithDelay = () => {
    setShowIcon(true);
  };

  const hideIconWithDelay = () => {
    hideIconTimeout = setTimeout(() => setShowIcon(false), 500);
  };

  const clearHideIconTimeout = () => {
    if (hideIconTimeout) {
      clearTimeout(hideIconTimeout);
    }
  };

  function handleRemoveNode(nodeId: string): void {
    const nodesUpdated = nodes.filter((node) => node.id !== nodeId);
    const edgesUpdated = edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId,
    );
    onUpdateNodes(nodesUpdated, edgesUpdated);
  }

  function handleDuplicateNode(nodeId: string): void {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
    if (nodeToDuplicate) {
      const newNodeId = createUniqNodeId(nodeToDuplicate.data.processorType);

      const newNode = {
        ...nodeToDuplicate,
        id: newNodeId,
        data: {
          ...nodeToDuplicate.data,
          name: newNodeId,
          isDone: false,
          lastRun: undefined,
        },
        position: {
          x: nodeToDuplicate.position.x + DUPLICATED_NODE_OFFSET,
          y: nodeToDuplicate.position.y + DUPLICATED_NODE_OFFSET,
        },
      };
      const nodesUpdated = [...nodes, newNode];
      const edgesUpdated = [...edges];
      onUpdateNodes(nodesUpdated, edgesUpdated);
    }
  }

  function handleClearOutput(nodeId: string): void {
    const nodeToUpdate = nodes.find((node) => node.id === nodeId);
    if (nodeToUpdate) {
      const nodesUpdated = nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              outputData: undefined,
            },
          };
        }
        return node;
      });
      onUpdateNodes(nodesUpdated, edges);
    }
  }

  return (
    <div
      className={`group relative p-1 transition-all ${currentNodeIsMissingFields ? "rounded-lg border-2 border-dashed border-red-500/80" : ""}`}
      onClick={showIconWithDelay}
      onMouseLeave={hideIconWithDelay}
    >
      {children}
      <div
        className={`absolute right-1/2 top-0 flex -translate-y-14 translate-x-1/2 flex-row gap-x-2 
      transition-all duration-300 ease-in-out  ${showIcon ? "opacity-100" : "opacity-0"}`}
      >
        <span
          className="cursor-pointer 
                        rounded-full bg-slate-200/10
                        p-2
                        text-xl
                        text-stone-100
                        hover:bg-slate-200/20
                        hover:text-blue-400
                        "
          onClick={() => handleDuplicateNode(nodeId)}
          onMouseEnter={clearHideIconTimeout}
          onMouseLeave={hideIconWithDelay}
          style={{ display: showIcon ? "block" : "none" }}
        >
          <FaCopy />
        </span>
        <span
          className=" cursor-pointer 
                        rounded-full bg-slate-200/10
                        p-2
                        text-xl
                        text-stone-100
                        hover:bg-slate-200/20
                        hover:text-slate-50
                        "
          onClick={() => handleClearOutput(nodeId)}
          onMouseEnter={clearHideIconTimeout}
          onMouseLeave={hideIconWithDelay}
          style={{ display: showIcon ? "block" : "none" }}
        >
          <FaEraser />
        </span>
        <span
          className=" cursor-pointer 
                        rounded-full bg-slate-200/10
                        p-2
                        text-xl
                        text-stone-100
                        hover:bg-slate-200/20
                        hover:text-red-400
                        "
          onClick={() => handleRemoveNode(nodeId)}
          onMouseEnter={clearHideIconTimeout}
          onMouseLeave={hideIconWithDelay}
          style={{ display: showIcon ? "block" : "none" }}
        >
          <AiOutlineClose />
        </span>
      </div>
    </div>
  );
}

export default NodeWrapper;
