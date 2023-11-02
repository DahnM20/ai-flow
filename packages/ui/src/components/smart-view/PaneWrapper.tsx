import { FaColumns, FaBars, FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { MdOutlineVerticalSplit, MdHorizontalSplit } from 'react-icons/md';

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

    const nodeKind = name?.split('#')[1]
    return (
        <div className="relative h-full ">
            {showTools &&
                <div className="p-4 flex text-center justify-center items-center 
                                text-sky-200/95 hover:text-slate-100 group 
                                border-b-2 border-b-sky-800/30
                                bg-zinc-950/    5
                                hover:bg-zinc-900">
                    <div className="absolute top-0 left-0 py-1 pl-2 whitespace-nowrap">
                        {
                            nodeKind &&
                            nodeKind + ' - ' + fieldName
                        }
                    </div>
                    <div className="absolute top-0 right-0 space-x-2 pr-2 my-1 bg-zinc-900
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