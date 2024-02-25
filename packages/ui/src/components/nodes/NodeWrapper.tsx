import React, { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { NodeContext } from "../../providers/NodeProvider";
import { FaCopy, FaEraser } from "react-icons/fa";
import { NodeResizer } from "reactflow";
import { GiResize } from "react-icons/gi";
import ActionGroup, { Action } from "../selectors/ActionGroup";

type NodeWrapperProps = {
  children: React.ReactNode;
  nodeId: string;
};

type NodeActions = "clear" | "duplicate" | "remove";

function NodeWrapper({ children, nodeId }: NodeWrapperProps) {
  const [resize, setResize] = useState(false);
  const { findNode, duplicateNode, removeNode, clearNodeOutput } =
    useContext(NodeContext);

  const currentNode = findNode(nodeId);
  const currentNodeIsMissingFields =
    currentNode?.data?.missingFields?.length > 0;

  let hideResizeTimeout: ReturnType<typeof setTimeout>;

  const [showActions, setShowActions] = useState(false);

  let hideActionsTimeout: ReturnType<typeof setTimeout>;

  const hideActionsWithDelay = () => {
    hideActionsTimeout = setTimeout(() => setShowActions(false), 500);
  };

  const clearHideActionsTimeout = () => {
    if (hideActionsTimeout) {
      clearTimeout(hideActionsTimeout);
    }
  };

  const hideResizeWithDelay = () => {
    hideResizeTimeout = setTimeout(() => setResize(false), 5000);
  };

  const clearHideResizeTimeout = () => {
    if (hideResizeTimeout) {
      clearTimeout(hideResizeTimeout);
    }
  };

  function handleEnableResize(): void {
    setResize(!resize);
  }

  const actions: Action<NodeActions>[] = [
    {
      icon: <FaCopy />,
      name: "Duplicate",
      value: "duplicate",
      onClick: () => duplicateNode(nodeId),
    },
    {
      icon: <FaEraser />,
      name: "Clear output",
      value: "clear",
      onClick: () => clearNodeOutput(nodeId),
    },
    {
      icon: <AiOutlineClose />,
      name: "Remove",
      value: "remove",
      onClick: () => removeNode(nodeId),
      hoverColor: "text-red-400",
    },
  ];

  return (
    <div
      className={`group relative flex h-full w-full p-1 transition-all ${currentNodeIsMissingFields ? "rounded-lg border-2 border-dashed border-red-500/80" : ""}`}
      onClick={() => setShowActions(true)}
      onMouseLeave={() => {
        hideActionsWithDelay();
        hideResizeWithDelay();
      }}
      onMouseEnter={clearHideResizeTimeout}
    >
      <NodeResizer
        isVisible={resize}
        minWidth={450}
        maxWidth={1500}
        minHeight={200}
        maxHeight={1000}
      />
      {children}
      <div
        className={`absolute right-1/2 top-0 flex -translate-y-14 translate-x-1/2 transition-all duration-300 ease-in-out  ${showActions ? "opacity-100" : "opacity-0"}`}
        onMouseEnter={clearHideActionsTimeout}
        onMouseLeave={hideActionsWithDelay}
      >
        <ActionGroup actions={actions} showIcon={showActions} />
      </div>
    </div>
  );
}

export default NodeWrapper;
