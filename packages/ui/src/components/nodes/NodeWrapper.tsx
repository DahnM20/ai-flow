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
import { FiCircle } from "react-icons/fi";
import { BsFillCircleFill } from "react-icons/bs";

type NodeWrapperProps = {
  children: React.ReactNode;
  nodeId: string;
};

type NodeActions = "clear" | "duplicate" | "remove" | "sidepane" | "color";

function NodeWrapper({ children, nodeId }: NodeWrapperProps) {
  const { t } = useTranslation("flow");
  const [resize, setResize] = useState(false);
  const { getElement, setSidepaneActiveTab } = useVisibility();

  const {
    findNode,
    duplicateNode,
    removeNode,
    clearNodeOutput,
    setCurrentNodeIdSelected,
    updateNodeAppearance,
  } = useContext(NodeContext);

  const currentNode = findNode(nodeId);
  const currentNodeColor = currentNode?.data?.appearance?.color;
  const currentNodeIsMissingFields =
    currentNode?.data?.missingFields?.length > 0;

  let hideResizeTimeout: ReturnType<typeof setTimeout>;

  const [showActions, setShowActions] = useState(false);
  const [showColors, setShowColors] = useState(false);

  let hideActionsTimeout: ReturnType<typeof setTimeout>;

  const hideActionsWithDelay = () => {
    hideActionsTimeout = setTimeout(() => {
      setShowColors(false);
      setShowActions(false);
    }, 2000);
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
    getElement("sidebar").show();
    setSidepaneActiveTab("current_node");
  }

  function handleChangeNodeColor(color: string): void {
    if (color === "transparent") {
      updateNodeAppearance(nodeId, { color: undefined });
    } else {
      updateNodeAppearance(nodeId, { color });
    }
  }

  const actions: Action<NodeActions>[] = [
    {
      icon: (
        <div
          className="h-5 w-5 rounded-full"
          style={{
            backgroundColor: currentNodeColor,
            border: currentNodeColor ? "none" : "solid white 1px",
          }}
        ></div>
      ),
      name: t("NodeColor"),
      value: "color",
      tooltipPosition: "left",
      onClick: () => setShowColors(!showColors),
    },
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
      onClick: () => {
        setCurrentNodeIdSelected("");
        removeNode(nodeId);
      },
      hoverColor: "text-red-400",
    },
  ];

  const colorList = [
    "transparent",
    "chocolate",
    "firebrick",
    "cyan",
    "greenyellow",
    "gold",
    "blueviolet",
    "magenta",
  ];

  return (
    <div
      className={`group relative flex h-full w-full rounded-lg p-1 transition-all duration-300 ease-in-out
        ${currentNodeIsMissingFields ? "border-2 border-dashed border-red-500/80" : ""}`}
      onClick={() => {
        setShowActions(true);
        setCurrentNodeIdSelected(nodeId);
      }}
      onMouseLeave={() => {
        hideActionsWithDelay();
        hideResizeWithDelay();
      }}
      onMouseEnter={clearHideActionsTimeout}
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
        className={`absolute right-1/2 top-0 flex -translate-y-14 translate-x-1/2 transition-all duration-300 ease-in-out  ${showActions ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onMouseEnter={clearHideActionsTimeout}
      >
        <ActionGroup actions={actions} showIcon />
        <div
          className={`absolute flex -translate-x-1/3 -translate-y-10 items-center justify-center space-x-2 rounded-full bg-slate-200/10 p-2 ${showColors ? "opacity-100 " : "pointer-events-none opacity-0"} transition-all duration-300 ease-in-out `}
        >
          {colorList.map((color, index) => (
            <div
              key={index}
              className="h-4 w-4 rounded-full ring-slate-200 transition-all duration-150 ease-in-out hover:ring-2"
              style={{
                backgroundColor: color,
              }}
              onClick={() => handleChangeNodeColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NodeWrapper;
