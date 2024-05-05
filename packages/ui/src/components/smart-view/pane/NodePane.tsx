import { FiFeather, FiPlus } from "react-icons/fi";
import { BasicPane, LayoutIndex, TextOptions } from "../RenderLayout";
import { useContext, useMemo, useState } from "react";
import { NodeContext } from "../../../providers/NodeProvider";
import AttachNodeDialog from "../AttachNodeDialog";
import { useFormFields } from "../../../hooks/useFormFields";
import { LoadingIcon } from "../../nodes/Node.styles";
import OutputDisplay from "../../nodes/node-output/OutputDisplay";

interface NodePaneProps {
  nodeId?: string;
  fieldNames?: string[];
  index?: LayoutIndex;
  paneData: BasicPane;
  onAttachNode?: (
    index: LayoutIndex,
    nodeId?: string,
    fieldNames?: string[],
  ) => void;
  onAttachText?: (
    index: LayoutIndex,
    text: string,
    options?: TextOptions,
  ) => void;
}

function NodePane({
  nodeId,
  fieldNames,
  onAttachNode,
  onAttachText,
  index,
  paneData,
}: NodePaneProps) {
  const outputFieldName = "outputData";

  const { nodes, onUpdateNodeData, currentNodesRunning, isRunning } =
    useContext(NodeContext);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isAttachNodeVisible, setIsAttachNodeVisible] = useState(false);

  const currentNode = useMemo(
    () => nodes.find((n) => n.data.name === nodeId),
    [nodeId, nodes],
  );

  function handleAttachNode() {
    setPopupOpen(true);
  }

  function handleSetText(text?: string) {
    if (!!onAttachText && index != null) {
      onAttachText(index, text ?? "<Enter Your Text>");
    }
  }

  function handleSubmit(nodeName: string, fieldNames: string[]) {
    if (!!onAttachNode && index != null) {
      onAttachNode(index, nodeName, fieldNames);
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
    {
      specificFields: fieldNames,
      showLabels: true,
    },
  );

  const isCurrentNodeRunning =
    !!nodeId &&
    currentNodesRunning.includes(nodeId) &&
    isRunning &&
    fieldNames?.includes(outputFieldName);

  const isTextPane = paneData.text != null;

  const hasOutputDataField = fieldNames?.includes(outputFieldName);

  return (
    <div
      className="group min-h-0 w-full flex-grow"
      key={`${nodeId}-${fieldNames}-${index}`}
      onMouseEnter={() => setIsAttachNodeVisible(true)}
      onMouseLeave={() =>
        setIsAttachNodeVisible(currentNode != null && fieldNames != null)
      }
    >
      {renderPaneBody()}

      <AttachNodeDialog
        isOpen={popupOpen}
        setIsOpen={setPopupOpen}
        handleClose={() => setPopupOpen(false)}
        handleSubmit={handleSubmit}
      />
    </div>
  );

  function renderPaneBody() {
    if (isTextPane) {
      return (
        <div className="h-full p-2">
          <textarea
            value={paneData.text}
            className="h-full w-full bg-transparent text-center text-lg outline-none"
            onChange={(e) => handleSetText(e.target.value)}
          />
        </div>
      );
    }
    if (isCurrentNodeRunning) {
      return (
        <div className="flex h-full w-full items-center justify-center text-sky-300">
          <LoadingIcon className="h-[10%] w-[10%] " />
        </div>
      );
    }
    if (currentNode != null && fieldNames) {
      return (
        <div
          className={`flex h-full w-full flex-col overflow-y-auto px-2 text-justify text-lg text-slate-300`}
        >
          {hasOutputDataField ? (
            <OutputDisplay data={currentNode.data} />
          ) : (
            formFields
          )}
        </div>
      );
    }
    return renderAttachActions();
  }

  function renderAttachActions() {
    return (
      <div
        className={`flex h-full w-full items-center
                                      justify-center space-x-3 
                                      text-4xl text-sky-600 transition-all duration-500 ease-in-out ${isAttachNodeVisible ? "opacity-100" : "opacity-0"}`}
      >
        <FiPlus
          className="rounded-full p-1 ring-2 ring-sky-600/50 transition-opacity  duration-300 ease-linear hover:text-sky-300"
          onClick={handleAttachNode}
        />
        <FiFeather
          className="rounded-full p-1 ring-2 ring-sky-600/50 transition-opacity  duration-300 ease-linear hover:text-sky-300"
          onClick={() => handleSetText()}
        />
      </div>
    );
  }
}

export default NodePane;
