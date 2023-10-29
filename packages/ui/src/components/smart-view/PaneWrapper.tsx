import { FaColumns, FaBars, FaTrash } from "react-icons/fa";

interface PaneWrapperProps {
    children: JSX.Element;
    name?: string;
    showTools: boolean;
    onSplitHorizontal: () => void;
    onSplitVertical: () => void;
    onDelete: () => void;
}

function PaneWrapper({ children, name, showTools, onSplitHorizontal, onSplitVertical, onDelete }: PaneWrapperProps) {
    return (
        <div className="relative h-full">
            {showTools &&
                <div className="p-4 flex text-center justify-center items-center text-slate-400">
                    <div className="absolute top-0 left-0 py-1 pl-2">
                        {name}
                    </div>
                    <div className="absolute top-0 right-0 space-x-2 pr-2 py-1">
                        <button onClick={onSplitHorizontal}>
                            <FaColumns />
                        </button>
                        <button onClick={onSplitVertical}>
                            <FaBars />
                        </button>
                        <button onClick={onDelete}>
                            <FaTrash />
                        </button>
                    </div>
                </div>
            }
            {children}
        </div>
    );
}

export default PaneWrapper;