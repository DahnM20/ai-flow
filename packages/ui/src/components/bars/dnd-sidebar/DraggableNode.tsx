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
import { DraggableNodeAdditionnalData } from "./types";

interface DraggableNodeProps extends DraggableNodeAdditionnalData {
  node: DnDNode;
  id?: string;
}

interface NodeBadgeProps {
  children?: ReactNode;
  color?: string;
}
const NodeBadge = ({ children, color = "#0369a1" }: NodeBadgeProps) => (
  <div
    className={`absolute left-3 top-3 translate-x-[-50%] translate-y-[-50%] -rotate-45 transform px-5 text-xs text-white`}
    style={{ backgroundColor: color }}
  >
    {children}
  </div>
);

const DraggableNode = (props: DraggableNodeProps) => {
  const { t } = useTranslation("flow");

  const [{ isDragging }, drag] = useDrag({
    type: "NODE",
    item: {
      nodeType: props.node.type,
      additionnalData: props.additionnalData,
      additionnalConfig: props.additionnalConfig,
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
        bandColor={props.node.color}
        className={`sidebar-dnd-node text-md text-af-text-element hover:ring-af-text-element/10 group group relative 
                  flex
                  h-auto
                  w-full cursor-grab flex-row
                  items-center justify-between gap-x-1 overflow-hidden
                  rounded-md py-2 text-center
                  font-medium
                  shadow-md transition-all duration-200 
                  ease-in-out hover:ring-2 
                  ${isDragging ? "opacity-10" : ""}`}
      >
        <div className="flex w-full flex-row items-center justify-between space-x-1 px-2 text-center">
          <p className="flex-grow truncate ">{t(props.node.label)}</p>
          <GripIcon className="text-af-text-description/60 group-hover:text-af-text-element/60 h-4 w-4 transition-colors duration-75 ease-in-out" />
        </div>

        {props.node.isBeta && <NodeBadge>Beta</NodeBadge>}
        {props.node.isNew && <NodeBadge color="#166e4c">New</NodeBadge>}
      </Node>
    </Tooltip>
  );
};

export const Node = styled.div<{ bandColor?: string }>`
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
