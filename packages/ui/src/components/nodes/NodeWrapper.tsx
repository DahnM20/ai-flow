import React, { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { NodeContext } from "../../providers/NodeProvider";
import { FaCopy, FaEraser } from "react-icons/fa";
import { NodeResizer } from "reactflow";
import { GiResize } from "react-icons/gi";
import ActionGroup, { Action } from "../selectors/ActionGroup";
import { MdMenuOpen } from "react-icons/md";
import { useVisibility } from "../../providers/VisibilityProvider";
import { useTranslation } from "react-i18next";

type NodeWrapperProps = {
  children: React.ReactNode;
  nodeId: string;
};

type NodeActions = "clear" | "duplicate" | "remove" | "sidepane";

function NodeWrapper({ children, nodeId }: NodeWrapperProps) {
  const { t } = useTranslation("flow");
  const [resize, setResize] = useState(false);
  const { getElement } = useVisibility();

  const {
    findNode,
    duplicateNode,
    removeNode,
    clearNodeOutput,
    setCurrentNodeIdSelected,
  } = useContext(NodeContext);

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

  function handleOpenSidepane(): void {
    getElement("sidebar").toggle();
  }

  const actions: Action<NodeActions>[] = [
    {
      icon: <FaCopy />,
      name: t("Duplicate"),
      value: "duplicate",
      onClick: () => duplicateNode(nodeId),
    },
    {
      icon: <MdMenuOpen />,
      name: t("OpeninSidepane"),
      value: "sidepane",
      onClick: () => handleOpenSidepane(),
    },
    {
      icon: <FaEraser />,
      name: t("ClearOutput"),
      value: "clear",
      onClick: () => clearNodeOutput(nodeId),
    },
    {
      icon: <AiOutlineClose />,
      name: t("RemoveNode"),
      value: "remove",
      onClick: () => removeNode(nodeId),
      hoverColor: "text-red-400",
    },
  ];

  return (
    <div
      className={`group relative flex h-full w-full p-1 transition-all ${currentNodeIsMissingFields ? "rounded-lg border-2 border-dashed border-red-500/80" : ""}`}
      onClick={() => {
        setShowActions(true);
        setCurrentNodeIdSelected(nodeId);
      }}
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
