import { useDrag } from "react-dnd";
import { useTranslation } from "react-i18next";
import { DnDNode } from "../../../nodes-configuration/sectionConfig";
import { ReactNode, memo } from "react";
import styled from "styled-components";
import { toastCustomIconInfoMessage } from "../../../utils/toastUtils";
import { FiMenu, FiMove } from "react-icons/fi";
import { darken, lighten } from "polished";
import { Tooltip } from "@mantine/core";
import { GripIcon } from "./GripIcon";

interface DraggableNodeProps {
  node: DnDNode;
  id?: string;
  additionnalNodeData?: any;
  additionnalNodeConfig?: any;
}

interface NodeBadgeProps {
  children?: ReactNode;
}
const NodeBadge = ({ children }: NodeBadgeProps) => (
  <div className="absolute left-3 top-3 translate-x-[-50%] translate-y-[-50%] -rotate-45 transform bg-sky-700 px-5 text-xs text-white">
    {children}
  </div>
);

const DraggableNode = (props: DraggableNodeProps) => {
  const { t } = useTranslation("flow");

  const [{ isDragging }, drag] = useDrag({
    type: "NODE",
    item: {
      nodeType: props.node.type,
      additionnalData: props.additionnalNodeData,
      additionnalConfig: props.additionnalNodeConfig,
    },
    collect: (monitor) => {
      const result = {
        isDragging: monitor.isDragging(),
      };
      return result;
    },
  });

  function showDragAndDropHelper() {
    if (localStorage.getItem("AIFLOW_didShowDragDropHelper") === "true") {
      return;
    }
    toastCustomIconInfoMessage(
      "Drag and drop nodes onto the canvas to add them.",
      FiMove,
    );
    localStorage.setItem("AIFLOW_didShowDragDropHelper", "true");
  }

  return (
    <Tooltip
      label={t(props.node.helpMessage ?? "")}
      color="gray"
      openDelay={300}
    >
      <Node
        ref={drag}
        id={props.id ?? props.node.type}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
        onDoubleClick={(e) => {
          showDragAndDropHelper();
        }}
        className={`sidebar-dnd-node text-md group group relative flex h-auto 
                  w-full
                  cursor-grab
                  flex-row items-center justify-between
                  gap-x-1 overflow-hidden rounded-md py-2
                  text-center font-medium text-slate-200
                  shadow-md
                  transition-all duration-200 ease-in-out 
                  hover:ring-2 hover:ring-slate-200/10 
                  ${isDragging ? "opacity-10" : ""}`}
      >
        <div className="flex w-full flex-row items-center justify-between space-x-1 px-2 text-center">
          <p className="flex-grow truncate ">{t(props.node.label)}</p>
          <GripIcon className="h-4 w-4 text-slate-400/60 transition-colors duration-75 ease-in-out group-hover:text-slate-200/60" />
        </div>

        {props.node.isBeta && <NodeBadge>Beta</NodeBadge>}
      </Node>
    </Tooltip>
  );
};

const Node = styled.div<{ bandColor?: string }>`
  background:
    linear-gradient(
        120deg,
        ${({ bandColor }) => (bandColor ? lighten(0.05, bandColor) : "#84fab0")}
          0%,
        ${({ bandColor }) => (bandColor ? darken(0.1, bandColor) : "#8fd3f4")}
          100%
      )
      left / 2% no-repeat,
    ${({ theme }) => theme.bg};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

export default memo(DraggableNode);
