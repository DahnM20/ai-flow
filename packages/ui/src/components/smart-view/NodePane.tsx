import { FiPlus } from "react-icons/fi";
import { LayoutIndex } from "./RenderLayout";
import { useContext, useMemo, useState } from "react";
import { NodeContext } from "../providers/NodeProvider";
import AttachNodeDialog from "./AttachNodeDialog";

interface NodePaneProps {
    nodeId?: string;
    index: LayoutIndex;
    onAttachNode: (index: LayoutIndex, nodeId?: string) => void;
}

function NodePane({ nodeId, onAttachNode, index }: NodePaneProps) {

    const { nodes } = useContext(NodeContext);
    const [popupOpen, setPopupOpen] = useState(false);

    const currentNode = useMemo(() => nodes.find(n => n.data.name === nodeId), [nodeId, nodes]);

    const color = useMemo(() => getRandomColor(), []);

    function getRandomColor() {
        const getRandom = () => Math.floor(Math.random() * 256);
        return `rgba(${getRandom()}, ${getRandom()}, ${getRandom()}, 0.15)`;
    }

    function handleAttachNode() {
        setPopupOpen(true);
    }

    function handleSubmit(nodeName: string, fieldName: string) {
        onAttachNode(index, nodeName);
    }

    return (
        <div className="h-full w-full overflow-y-auto" style={{ backgroundColor: !currentNode ? color : "rgb(30, 30, 31)" }}>
            {
                nodeId
                    ? <div className="w-full h-full flex p-4 text-slate-300/95 text-justify">
                        {currentNode?.data.outputData}
                    </div>
                    : <div className="w-full h-full flex 
                                      justify-center items-center 
                                      text-4xl text-sky-600  hover:text-sky-300">
                        <FiPlus className="ring-2 rounded-full ring-sky-600/50" onClick={handleAttachNode} />
                    </div>
            }

            <AttachNodeDialog isOpen={popupOpen}
                setIsOpen={setPopupOpen}
                handleClose={() => setPopupOpen(false)}
                handleSubmit={handleSubmit} />

        </div>
    )
}

export default NodePane;