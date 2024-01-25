import { useDrag } from "react-dnd";
import { useTranslation } from "react-i18next";
import { DnDNode } from "../../../nodes-configuration/sectionConfig";
import { ReactNode, memo, useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";

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

  return (
    <Node
      ref={drag}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
      className={`text-md group relative flex h-auto w-full 
                  cursor-grab
                  flex-row items-center justify-center
                  gap-x-1 overflow-hidden rounded-md px-3 py-2
                  text-center font-medium text-slate-200
                  shadow-md
                  transition-all duration-200 ease-in-out 
                  hover:ring-2 hover:ring-slate-200/10 
                  ${isDragging ? "opacity-10" : ""}`}
    >
      {t(props.node.label)}
      {props.node.helpMessage && !isDragging && (
        <div className="absolute left-5 flex items-center">
          <StyledInfoIcon
            className="opacity-0 group-hover:opacity-100"
            data-tooltip-id={`dnd-tooltip`}
            data-tooltip-content={t(props.node.helpMessage)}
          />
        </div>
      )}
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

const StyledInfoIcon = styled(FaInfoCircle)``;

export default memo(DraggableNode);
