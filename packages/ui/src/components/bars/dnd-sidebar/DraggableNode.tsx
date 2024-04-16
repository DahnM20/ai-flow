import { useDrag } from "react-dnd";
import { useTranslation } from "react-i18next";
import { DnDNode } from "../../../nodes-configuration/sectionConfig";
import { ReactNode, memo } from "react";
import styled from "styled-components";
import { toastCustomIconInfoMessage } from "../../../utils/toastUtils";
import { FiMove } from "react-icons/fi";

interface DraggableNodeProps {
  node: DnDNode;
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
    item: { nodeType: props.node.type },
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
    <Node
      ref={drag}
      id={props.node.type}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        showDragAndDropHelper();
      }}
      className={`sidebar-dnd-node text-md group relative flex h-auto w-full 
                  cursor-grab
                  flex-row items-center justify-between
                  gap-x-1 overflow-hidden rounded-md py-2
                  text-center font-medium text-slate-200
                  shadow-md
                  transition-all duration-200 ease-in-out 
                  hover:ring-2 hover:ring-slate-200/10 
                  ${isDragging ? "opacity-10" : ""}`}
      data-tooltip-id={`dnd-tooltip`}
      data-tooltip-content={t(props.node.helpMessage ?? "")}
    >
      <div className="flex-grow px-2 text-center">{t(props.node.label)}</div>

      {props.node.isBeta && <NodeBadge>Beta</NodeBadge>}
    </Node>
  );
};

const Node = styled.div`
  background:
    linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) right / 2% no-repeat,
    ${({ theme }) => theme.bg};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

export default memo(DraggableNode);
