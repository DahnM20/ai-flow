import { useDrag } from "react-dnd";
import { useTranslation } from "react-i18next";
import { DnDNode } from "../../../nodesConfiguration/nodeConfig";
import { memo } from "react";
import { FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";

interface DraggableNodeProps {
    node: DnDNode;
}

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
                  justify-center items-center text-center
                  h-auto py-2 rounded-md 
                  hover:ring-2
                  hover:ring-slate-200/50
                  font-medium
                  shadow-md
                  cursor-grab'
        >
            {t(props.node.label)}
            {
                props.node.helpMessage &&
                <StyledInfoIcon
                    data-tooltip-id={`dnd-tooltip`}
                    data-tooltip-content={t(props.node.helpMessage)}
                />
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