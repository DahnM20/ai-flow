import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { MdOutlineVerticalSplit, MdHorizontalSplit } from 'react-icons/md';
import { getConfigViaType } from "../../nodesConfiguration/nodeConfig";
import { NodeType } from "../../utils/mappings";
import { ICON_MAP } from "../shared/NodeIcons";

interface PaneWrapperProps {
    children: JSX.Element;
    name?: string;
    fieldName?: string;
    showTools: boolean;
    onSplitHorizontal: () => void;
    onSplitVertical: () => void;
    onDelete: () => void;
}

function PaneWrapper({ children, name, fieldName, showTools, onSplitHorizontal, onSplitVertical, onDelete }: PaneWrapperProps) {

    const nodeType = name?.split('#')[1]
    let nodeConfig = null;
    if (!!nodeType) {
        nodeConfig = getConfigViaType(nodeType as NodeType)
    }
    const NodeIconComponent = nodeConfig ? ICON_MAP[nodeConfig?.icon] : null;

    return (
        <div className="relative h-full border-b-sky-800/30 shadow-3xl">
            {showTools &&
                <div className="p-4 flex text-center justify-center items-center
                                text-slate-100/80 hover:text-slate-100 group
                                bg-zinc-950/3
                                hover:bg-zinc-900">
                    <div className="absolute left-0 py-1 pl-2 whitespace-nowrap text-md
                                    text-center items-center 
                                    flex flex-row space-x-3">
                        {
                            NodeIconComponent && <NodeIconComponent />
                        }
                        {
                            nodeType &&
                            <p>
                                {nodeType + ' - ' + fieldName}
                            </p>
                        }
                    </div>
                    <div className="absolute right-0 space-x-2 pr-2 bg-zinc-900
                    group-hover:opacity-100 invisible group-hover:visible transition-opacity ease-linear duration-200">
                        <PaneWrapperButton onClick={onSplitHorizontal}>
                            <MdOutlineVerticalSplit />
                        </PaneWrapperButton>
                        <PaneWrapperButton onClick={onSplitVertical}>
                            <MdHorizontalSplit />
                        </PaneWrapperButton>
                        <PaneWrapperButton onClick={onDelete}>
                            <FaTimes />
                        </PaneWrapperButton>
                    </div>
                </div>
            }
            {children}
        </div>
    );
}

const PaneWrapperButton = styled.button.attrs({
    className: "rounded p-1 hover:bg-sky-800/80",
})``;

export default PaneWrapper;