import React, { useContext, memo, useState } from "react";
import { FiCrosshair, FiDownload, FiSave, FiUpload } from "react-icons/fi";
import { Edge, Node } from "reactflow";
import {
  clearSelectedNodes,
  convertFlowToJson,
  convertJsonToFlow,
  nodesTopologicalSort,
} from "../../utils/flowUtils";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { NodeContext } from "../../providers/NodeProvider";
import { FaExclamationTriangle } from "react-icons/fa";
import DefaultSwitch from "../buttons/DefaultSwitch";
import { toastInfoMessage } from "../../utils/toastUtils";
import AddTemplatePopup from "../popups/AddTemplatePopup";
import { TemplateFormData, saveTemplate } from "../../api/template";

interface JSONViewProps {
  nodes: Node[];
  edges: Edge[];
  onChangeFlow: (nodes: Node[], edges: Edge[]) => void;
}

const JSONView: React.FC<JSONViewProps> = ({ nodes, edges, onChangeFlow }) => {
  const { t } = useTranslation("flow");
  const { removeAll, clearAllOutput } = useContext(NodeContext);
  const [showFieldsConfig, setShowFieldsConfig] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showAddTemplatePopup, setShowAddTemplatePopup] = useState(false);

  nodes = nodesTopologicalSort(nodes, edges);
  const data = convertFlowToJson(
    nodes,
    edges,
    showCoordinates,
    showFieldsConfig,
  );

  const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = () => {
      const file = input.files?.[0];

      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
          if (evt.target) {
            const flow = evt.target.result as string;
            const { nodes, edges } = convertJsonToFlow(JSON.parse(flow));
            onChangeFlow(nodes, edges);
          }
        };
      }
    };

    input.click();
  };

  const handleDownloadClick = () => {
    const fullData = convertFlowToJson(nodes, edges, true, true);
    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  };

  const handleSaveAsTemplate = async (data: TemplateFormData) => {
    const nodesCleared = clearSelectedNodes(nodes);
    const flowData = convertFlowToJson(nodesCleared, edges, true, true);

    const response = await saveTemplate(data, flowData);

    if (response.status === 200) {
      toastInfoMessage("Template saved");
      setShowAddTemplatePopup(false);
    } else {
      toastInfoMessage("Error saving template");
    }
  };

  const openAddTemplatePopup = () => {
    setShowAddTemplatePopup(true);
  };

  return (
    <>
      <JSONViewContainer className="space-y-2">
        <JSONViewButtons>
          <JSONViewButton onClick={handleUploadClick}>
            <FiUpload />
            {t("Upload")}
          </JSONViewButton>
          <JSONViewButton onClick={handleDownloadClick}>
            <FiDownload />
            {t("Download")}
          </JSONViewButton>
          <JSONViewButton onClick={clearAllOutput} dangerous>
            <FiCrosshair />
            {t("Delete Output")}
          </JSONViewButton>
          <JSONViewButton onClick={removeAll} dangerous>
            <FaExclamationTriangle />
            {t("Delete All")}
          </JSONViewButton>
        </JSONViewButtons>
        <JSONViewButtons>
          <button
            onClick={openAddTemplatePopup}
            className="flex flex-row items-center justify-center space-x-1 rounded-md bg-teal-500/80 px-2 py-1 text-sm transition-all duration-300 ease-in-out hover:bg-teal-500"
          >
            <FiSave />
            <p>{t("Save as template")}</p>
          </button>
        </JSONViewButtons>
        <div className="mt-2 flex flex-col">
          <div className="flex flex-row items-center space-x-2">
            <DefaultSwitch
              onChange={(checked: boolean) => setShowFieldsConfig(checked)}
              checked={showFieldsConfig}
            />
            <p className="text-sm">Show nodes config</p>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <DefaultSwitch
              onChange={(checked: boolean) => setShowCoordinates(checked)}
              checked={showCoordinates}
            />
            <p className="text-sm">Show coordinates</p>
          </div>
        </div>
        <JSONViewContent className="mt-5">
          {JSON.stringify(data, null, 2)}
        </JSONViewContent>
      </JSONViewContainer>
      <AddTemplatePopup
        show={showAddTemplatePopup}
        onClose={() => setShowAddTemplatePopup(false)}
        onValidate={handleSaveAsTemplate}
      />
    </>
  );
};

const JSONViewContainer = styled.div`
  padding: 20px;
`;

const JSONViewButtons = styled.div.attrs({
  className: "flex space-x-1 justify-center",
})``;

const JSONViewButton = styled.button<{ dangerous?: boolean }>`
  display: flex;
  justify-items: center;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background-color: ${(props) => (props.dangerous ? "#c47769" : "#67a58a")};
  color: white;
  font-size: 0.8em;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.dangerous ? "#962121" : "#219653")};
  }
`;

const JSONViewContent = styled.pre`
  white-space: pre-wrap;
  font-family: monospace;
  padding: 10px;
  background-color: ${({ theme }) => theme.nodeInputBg};
`;

function arePropsEqual(prevProps: JSONViewProps, nextProps: JSONViewProps) {
  return (
    prevProps.nodes === nextProps.nodes && prevProps.edges === nextProps.edges
  );
}

export default memo(JSONView, arePropsEqual);
