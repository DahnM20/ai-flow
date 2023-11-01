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
import { LoadingIcon } from "../shared/Node.styles";

interface NodePaneProps {
    nodeId?: string;
    fieldName?: string;
    index?: LayoutIndex;
    onAttachNode?: (index: LayoutIndex, nodeId?: string, fieldName?: string) => void;
}

function NodePane({ nodeId, fieldName, onAttachNode, index }: NodePaneProps) {

    const outputFieldName = "outputData"

    const { nodes, onUpdateNodeData, currentNodeRunning, isRunning } = useContext(NodeContext);
    const [popupOpen, setPopupOpen] = useState(false);
    const { t } = useTranslation('flow');

    const currentNode = useMemo(() => nodes.find(n => n.data.name === nodeId), [nodeId, nodes]);

    function handleAttachNode() {
        setPopupOpen(true);
    }

    function handleSubmit(nodeName: string, fieldName: string) {
        if (!!onAttachNode && index != null) {
            onAttachNode(index, nodeName, fieldName);
        }
    }

    function getFieldConfig(): Field | undefined {
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

    const fieldConfig = getFieldConfig()
    const isTextField = fieldName && fieldConfig && ["input", "textarea"].includes(fieldConfig.type)

    const renderOutput = () => {
        if (!currentNode || !fieldName) return null;

        const isOutputDataField = fieldName === outputFieldName;
        const isImageUrlOutput = currentNode.data?.config?.outputType === "imageUrl";
        const data = currentNode.data?.[fieldName] || "No output";

        if (isOutputDataField && isImageUrlOutput) {
            return data ? <ImageUrlOutput url={data} name="" /> : <p>No Output</p>;
        }

        if (isOutputDataField && !isImageUrlOutput) {
            return <MarkdownOutput data={data} />;
        }

        return formFields;
    };

    const isCurrentNodeRunning = (currentNodeRunning === nodeId && isRunning && outputFieldName === fieldName)

    const renderLoadingIcon = () => {
        return <div className="w-full h-full flex justify-center items-center text-sky-300">
            <LoadingIcon className="h-[10%] w-[10%] " />
        </div>
    }

    return (
        <div className="h-full w-full group" style={{ backgroundColor: "rgb(30, 30, 31)" }}>
            {
                isCurrentNodeRunning
                    ? renderLoadingIcon()
                    : (currentNode != null && fieldName)
                        ? <div className={`w-full overflow-y-auto h-[95%] flex pt-2 px-3 pb-10 text-slate-300 text-justify justify-center text-lg 
                                        ${isTextField || fieldName === "outputData" ? "" : "items-center"}`}>
                            {renderOutput()}
                        </div>
                        : <div className="w-full h-full flex 
                                      justify-center items-center 
                                      text-4xl text-sky-600  ">
                            <FiPlus className="ring-2 rounded-full ring-sky-600/50 hover:text-sky-300 invisible group-hover:visible  transition-opacity ease-linear duration-300" onClick={handleAttachNode} />
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