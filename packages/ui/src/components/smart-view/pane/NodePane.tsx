import { FiAlignLeft, FiDatabase, FiPlus, FiType } from "react-icons/fi";
import { useContext, useMemo, useState } from "react";
import { NodeContext } from "../../../providers/NodeProvider";
import { useFormFields } from "../../../hooks/useFormFields";
import { LoadingIcon } from "../../nodes/Node.styles";
import OutputDisplay from "../../nodes/node-output/OutputDisplay";
import { BasicPane, LayoutIndex, TextOptions } from "../LayoutView";
import { Menu } from "@mantine/core";
import AttachNodeDialog from "../AttachNodeDialog";

interface NodePaneProps {
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
  isEnabled: boolean;
}

function NodePane({
  onAttachNode,
  onAttachText,
  index,
  paneData,
  isEnabled,
}: NodePaneProps) {
  const outputFieldName = "outputData";

  const { nodes, onUpdateNodeData, currentNodesRunning, isRunning, findNode } =
    useContext(NodeContext);
  const [popupOpen, setPopupOpen] = useState(false);

  const nodeId = paneData.nodeId;
  const fieldNames = paneData.fieldNames;
  const hasMultipleFields = fieldNames && fieldNames?.length > 1;

  const currentNode = useMemo(() => findNode(nodeId ?? ""), [nodeId, nodes]);

  function handleAttachNode() {
    setPopupOpen(true);
  }

  function handleSetText(text?: string) {
    if (!!onAttachText && index != null) {
      onAttachText(index, text ?? "<Enter Your Text>", paneData.options);
    }
  }

  function handleSetHeading(text?: string) {
    if (!!onAttachText && index != null) {
      onAttachText(index, text ?? "<Enter Your Text>", {
        fontSize: "xl",
        textAlign: "center",
        isHeading: true,
      });
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
      showLabels: hasMultipleFields,
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
      className={`group h-full w-full overflow-hidden rounded-md p-3 hover:overflow-auto`}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      key={`${nodeId}-${fieldNames}-${index}`}
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
      if (paneData.options?.isHeading) {
        return (
          <div className="h-full w-full items-center justify-center text-2xl font-bold text-slate-100">
            {isEnabled ? (
              <textarea
                value={paneData.text}
                className="h-full w-full bg-transparent text-center outline-none"
                onChange={(e) => handleSetText(e.target.value)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {paneData.text}
              </div>
            )}
          </div>
        );
      } else {
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
                                      justify-center
                                     text-4xl text-sky-600 opacity-100 transition-all duration-500 ease-in-out`}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <Menu shadow="md" width={200} closeOnClickOutside>
          <Menu.Target>
            <span>
              <FiPlus className="rounded-full p-1 ring-2 ring-sky-600/50 transition-opacity  duration-300 ease-linear hover:text-sky-300" />
            </span>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Attach content</Menu.Label>
            <Menu.Item leftSection={<FiDatabase />} onClick={handleAttachNode}>
              Node Fields
            </Menu.Item>
            <Menu.Item
              leftSection={<FiType />}
              onClick={() => handleSetHeading()}
            >
              Heading
            </Menu.Item>
            <Menu.Item
              leftSection={<FiAlignLeft />}
              onClick={() => handleSetText()}
            >
              Text
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    );
  }
}

export default NodePane;
