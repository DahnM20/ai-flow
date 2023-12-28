import { useDrag } from "react-dnd";
import { useTranslation } from "react-i18next";
import { DnDNode } from "../../../nodesConfiguration/sectionConfig";
import { ReactNode, memo } from "react";
import { FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";

interface DraggableNodeProps {
    node: DnDNode;
}

interface NodeBadgeProps {
    children?: ReactNode;
}
const NodeBadge = ({ children }: NodeBadgeProps) => (
    <div className="absolute top-3 left-3 transform -rotate-45 translate-x-[-50%] translate-y-[-50%] bg-sky-700 text-white px-5 text-xs">
        {children}
    </div>
);

const DraggableNode = (props: DraggableNodeProps) => {

    const { t } = useTranslation('flow');
    const [, ref] = useDrag({
        type: 'NODE',
        item: { nodeType: props.node.type }
    });

    return (
        <Node
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
            }}
            className='flex flex-row w-full gap-x-1 text-md 
                  text-slate-200 
                  relative
                  justify-center items-center text-center
                  h-auto py-2 px-3 rounded-md 
                  hover:ring-2
                  hover:ring-slate-200/10
                  font-medium
                  shadow-md
                  cursor-grab
                  overflow-hidden
                  group'
        >
            {t(props.node.label)}
            {
                props.node.helpMessage &&
                <div className="absolute left-5 flex items-center">
                    <StyledInfoIcon
                        className="opacity-0 group-hover:opacity-100"
                        data-tooltip-id={`dnd-tooltip`}
                        data-tooltip-content={t(props.node.helpMessage)}
                    />
                </div>
            }
            {
                props.node.isBeta &&
                <NodeBadge>
                    Beta
                </NodeBadge>
            }
        </Node>
    );
};


const Node = styled.div`
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) right / 2% no-repeat, ${({ theme }) => theme.bg};
  user-select: none; 
  -webkit-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none;
`;

const StyledInfoIcon = styled(FaInfoCircle)`
`;

export default memo(DraggableNode);