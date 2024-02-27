import { FiPlus } from "react-icons/fi";
import { LayoutIndex } from "../RenderLayout";
import { useContext, useMemo, useState } from "react";
import { NodeContext } from "../../../providers/NodeProvider";
import AttachNodeDialog from "../AttachNodeDialog";
import { Field } from "../../../nodes-configuration/nodeConfig";
import { useTranslation } from "react-i18next";
import { useFormFields } from "../../../hooks/useFormFields";
import MarkdownOutput from "../../nodes/node-output/MarkdownOutput";
import ImageUrlOutput from "../../nodes/node-output/ImageUrlOutput";
import { LoadingIcon } from "../../nodes/Node.styles";
import VideoUrlOutput from "../../nodes/node-output/VideoUrlOutput";
import AudioUrlOutput from "../../nodes/node-output/AudioUrlOutput";

interface NodePaneProps {
  nodeId?: string;
  fieldName?: string;
  index?: LayoutIndex;
  onAttachNode?: (
    index: LayoutIndex,
    nodeId?: string,
    fieldName?: string,
  ) => void;
}

function NodePane({ nodeId, fieldName, onAttachNode, index }: NodePaneProps) {
  const outputFieldName = "outputData";

  const { nodes, onUpdateNodeData, currentNodesRunning, isRunning } =
    useContext(NodeContext);
  const [popupOpen, setPopupOpen] = useState(false);
  const { t } = useTranslation("flow");

  const currentNode = useMemo(
    () => nodes.find((n) => n.data.name === nodeId),
    [nodeId, nodes],
  );

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
      return currentNode?.data.config.fields.find(
        (field: Field) => field.name === fieldName,
      );
    }
  }

  const handleNodeDataChange = (fieldName: string, value: any) => {
    if (currentNode && currentNode.data) {
      onUpdateNodeData(currentNode.id, {
        ...currentNode.data,
        [fieldName]: value,
      });
    }
  };

  const formFields = useFormFields(
    currentNode?.data,
    nodeId ?? "",
    handleNodeDataChange,
    () => {},
    () => {},
    getFieldConfig()?.name,
  );

  const fieldConfig = getFieldConfig();
  const isTextField =
    fieldName &&
    fieldConfig &&
    ["input", "textarea"].includes(fieldConfig.type);

  const renderOutput = () => {
    if (!currentNode || !fieldName) return null;

    const isOutputDataField = fieldName === outputFieldName;
    const isImageUrlOutput =
      currentNode.data?.config?.outputType === "imageUrl";
    const isVideoUrlOutput =
      currentNode.data?.config?.outputType === "videoUrl";
    const isAudioUrlOutput =
      currentNode.data?.config?.outputType === "audioUrl";

    const data = currentNode.data?.[fieldName] || "No output";

    if (isOutputDataField && isImageUrlOutput) {
      return data ? (
        <ImageUrlOutput url={data} name={fieldName} />
      ) : (
        <p>No Output</p>
      );
    }

    if (isOutputDataField && isVideoUrlOutput) {
      return data ? (
        <VideoUrlOutput url={data} name={fieldName} />
      ) : (
        <p>No Output</p>
      );
    }

    if (isOutputDataField && isAudioUrlOutput) {
      return data ? (
        <AudioUrlOutput url={data} name={fieldName} />
      ) : (
        <p>No Output</p>
      );
    }

    if (isOutputDataField && !isImageUrlOutput) {
      return <MarkdownOutput data={data} />;
    }

    return formFields;
  };

  const isCurrentNodeRunning =
    !!nodeId &&
    currentNodesRunning.includes(nodeId) &&
    isRunning &&
    outputFieldName === fieldName;

  const renderLoadingIcon = () => {
    return (
      <div className="flex h-full w-full items-center justify-center text-sky-300">
        <LoadingIcon className="h-[10%] w-[10%] " />
      </div>
    );
  };

  return (
    <div
      className="group min-h-0 w-full flex-grow"
      key={`${nodeId}-${fieldName}-${index}`}
    >
      {isCurrentNodeRunning ? (
        renderLoadingIcon()
      ) : currentNode != null && fieldName ? (
        <div
          className={`flex h-full w-full justify-center overflow-y-auto px-3 py-2 text-justify text-lg text-slate-300 
                                        ${isTextField || fieldName === "outputData" ? "" : "items-center"}`}
        >
          {renderOutput()}
        </div>
      ) : (
        <div
          className="flex h-full w-full 
                                      items-center justify-center 
                                      text-4xl text-sky-600  "
        >
          <FiPlus
            className="invisible rounded-full ring-2 ring-sky-600/50 transition-opacity duration-300  ease-linear hover:text-sky-300 group-hover:visible"
            onClick={handleAttachNode}
          />
        </div>
      )}

      <AttachNodeDialog
        isOpen={popupOpen}
        setIsOpen={setPopupOpen}
        handleClose={() => setPopupOpen(false)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NodePane;
