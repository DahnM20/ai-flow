import React, { useContext, useState } from "react";
import { NodeContext } from "../../providers/NodeProvider";
import { FaCopy, FaEraser, FaQuestionCircle, FaRegCopy } from "react-icons/fa";
import ActionGroup, { Action } from "../selectors/ActionGroup";
import { MdDelete, MdEdit, MdMenuOpen } from "react-icons/md";
import { useVisibility } from "../../providers/VisibilityProvider";
import { useTranslation } from "react-i18next";
import ColorSelector from "../selectors/ColorSelector";
import { NodeHelpData } from "./utils/NodeHelp";
import NodeHelpPopover from "./NodeHelpPopover";

type NodeWrapperProps = {
  children: React.ReactNode;
  nodeId: string;
};

type NodeActions =
  | "clear"
  | "duplicate"
  | "ref"
  | "remove"
  | "sidepane"
  | "color"
  | "name"
  | "helper";

function NodeWrapper({ children, nodeId }: NodeWrapperProps) {
  const { t } = useTranslation("flow");
  const { t: tHelp } = useTranslation("nodeHelp");
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

  const currentNodeHelp = tHelp(currentNode?.data.processorType, {
    returnObjects: true,
  }) as NodeHelpData;

  const currentNodeColor = currentNode?.data?.appearance?.color;

  const currentNodeName =
    currentNode?.data?.appearance?.customName ??
    t(currentNode?.data?.config?.nodeName);

  const currentNodeIsMissingFields =
    currentNode?.data?.missingFields?.length > 0;

  const [showActions, setShowActions] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showTextField, setShowTextField] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  let hideActionsTimeout: ReturnType<typeof setTimeout>;

  const hideActionsWithDelay = () => {
    hideActionsTimeout = setTimeout(() => {
      setShowColors(false);
      setShowTextField(false);
      setShowActions(false);
    }, 2000);
  };

  const clearHideActionsTimeout = () => {
    if (hideActionsTimeout) {
      clearTimeout(hideActionsTimeout);
    }
  };

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

  function toggleHelp(): void {
    setShowHelp(!showHelp);
  }

  const actions: Action<NodeActions>[] = [
    {
      icon: (
        <div className="flex h-7 w-7 items-center justify-center">
          <div
            className="h-6 w-6 rounded-full"
            style={{
              backgroundColor: currentNodeColor,
              border: currentNodeColor ? "none" : "solid white 1px",
            }}
          ></div>
        </div>
      ),
      name: t("NodeColor"),
      value: "color",
      tooltipPosition: "left",
      onClick: () => {
        setShowColors(!showColors);
        setShowTextField(false);
      },
    },
    {
      icon: <MdEdit />,
      name: t("ChangeName"),
      value: "name",
      onClick: () => {
        setShowTextField(!showTextField);
        setShowColors(false);
      },
    },
    {
      icon: <FaCopy />,
      name: t("Duplicate"),
      value: "duplicate",
      onClick: () => duplicateNode(nodeId),
    },
    // {
    //   icon: <FaRegCopy />,
    //   name: t("CreateRef"),
    //   value: "ref",
    //   onClick: () => createNodeRef(nodeId),
    // },
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
      icon: <FaQuestionCircle />,
      name: t("Help"),
      value: "helper",
      onClick: () => toggleHelp(),
    },
    {
      icon: <MdDelete />,
      name: t("RemoveNode"),
      value: "remove",
      onClick: () => {
        setCurrentNodeIdSelected("");
        removeNode(nodeId);
      },
      hoverColor: "text-red-400",
    },
  ];

  return (
    <NodeHelpPopover
      showHelp={showHelp}
      data={currentNodeHelp}
      onClose={() => setShowHelp(false)}
    >
      <div
        className={`group relative flex h-full w-full rounded-lg p-1 transition-all duration-300 ease-in-out
        ${currentNodeIsMissingFields ? "border-2 border-dashed border-red-500/80" : ""}`}
        onClick={() => {
          setShowActions(true);
          setCurrentNodeIdSelected(nodeId);
        }}
        onMouseLeave={() => {
          hideActionsWithDelay();
        }}
        onMouseEnter={clearHideActionsTimeout}
      >
        {children}
        <div
          className={`nodrag absolute right-1/2 top-0 flex -translate-y-14 translate-x-1/2 transition-all duration-300 ease-in-out  ${showActions ? "opacity-100" : "pointer-events-none opacity-0"}`}
          onMouseEnter={clearHideActionsTimeout}
        >
          <span className="text-3xl">
            <ActionGroup actions={actions} showIcon />
          </span>
          <div
            className={`absolute flex -translate-x-1/3 -translate-y-10 items-center justify-center space-x-2 rounded-full bg-slate-200/10 p-2 ${showColors ? "opacity-100 " : "pointer-events-none opacity-0"} transition-all duration-300 ease-in-out `}
          >
            <ColorSelector onChangeColor={handleChangeNodeColor} />
          </div>
          <div
            className={`absolute flex -translate-y-20 translate-x-5 items-center justify-center  ${showTextField ? "opacity-100 " : "pointer-events-none opacity-0"} transition-all duration-300 ease-in-out `}
          >
            <div className="flex flex-col items-center justify-center rounded-lg bg-slate-200/10 p-2 text-center">
              <p> {t("EnterCustomName")}</p>
              <input
                className="bg-zinc-900/90 px-1 text-center"
                value={currentNodeName}
                onChange={(e) =>
                  updateNodeAppearance(nodeId, { customName: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowTextField(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </NodeHelpPopover>
  );
}

export default NodeWrapper;
