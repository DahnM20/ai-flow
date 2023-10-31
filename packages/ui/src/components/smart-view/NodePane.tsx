import { FiPlus } from "react-icons/fi";
import { LayoutIndex } from "./RenderLayout";
import { useContext, useMemo, useState } from "react";
import { NodeContext } from "../providers/NodeProvider";
import AttachNodeDialog from "./AttachNodeDialog";
import { Field } from "../../nodesConfiguration/nodeConfig";
import { useTranslation } from "react-i18next";
import { useFormFields } from "../../hooks/useFormFields";
import MarkdownOutput from "../shared/nodes-parts/MarkdownOutput";
import ImageUrlOutput from "../shared/nodes-parts/ImageUrlOutput";

interface NodePaneProps {
    nodeId?: string;
    fieldName?: string;
    index?: LayoutIndex;
    onAttachNode?: (index: LayoutIndex, nodeId?: string, fieldName?: string) => void;
}

function NodePane({ nodeId, fieldName, onAttachNode, index }: NodePaneProps) {

    const { nodes, onUpdateNodeData } = useContext(NodeContext);
    const [popupOpen, setPopupOpen] = useState(false);
    const { t } = useTranslation('flow');

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
        if (!!onAttachNode && index != null) {
            onAttachNode(index, nodeName, fieldName);
        }
    }

    function getFieldConfig() {
        if (!!currentNode?.data?.config) {
            return currentNode?.data.config.fields.find((field: Field) => field.name === fieldName);
        }
    }

    const handleOptionChange = (name: string, value: string) => {
        if (currentNode && currentNode.data) {
            onUpdateNodeData(currentNode.id, {
                ...currentNode.data,
                [name]: value,
            });
        }
    };

    const handleNodeDataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (currentNode && currentNode.data) {
            onUpdateNodeData(currentNode.id, {
                ...currentNode.data,
                [event.target.name]: event.target.value,
            });

        }
    };


    const formFields = useFormFields(
        currentNode?.data,
        nodeId ?? "",
        handleNodeDataChange,
        handleOptionChange,
        () => { },
        undefined,
        () => { },
        getFieldConfig()?.name
    );

    return (
        <div className="h-full w-full overflow-y-auto" style={{ backgroundColor: !currentNode ? color : "rgb(30, 30, 31)" }}>
            {
                (currentNode != null && fieldName)
                    ? <div className="w-full h-5/6 flex p-4 text-slate-300/95 text-justify justify-center">
                        {
                            fieldName === "outputData"
                                ? <>
                                    {
                                        !!currentNode?.data && currentNode?.data.config?.outputType === "imageUrl"
                                            ? currentNode?.data[fieldName]
                                                ? <ImageUrlOutput url={currentNode?.data[fieldName]} name="" />
                                                : <p> No Output </p>
                                            : <MarkdownOutput data={currentNode?.data[fieldName] ? currentNode?.data[fieldName] : "No output"} />
                                    }

                                </>
                                : formFields
                        }
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