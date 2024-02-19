import React, { useContext, memo, useState } from "react";
import { FiCrosshair, FiDownload, FiSave, FiUpload } from "react-icons/fi";
import { Edge, Node } from "reactflow";
import {
  clearAllOutput,
  convertFlowToJson,
  convertJsonToFlow,
  nodesTopologicalSort,
} from "../../utils/flowUtils";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { NodeContext } from "../../providers/NodeProvider";
import { FaExclamationTriangle } from "react-icons/fa";
import DefaultSwitch from "../buttons/DefaultSwitch";
import axios from "axios";
import { getRestApiUrl } from "../../config/config";
import { toastInfoMessage } from "../../utils/toastUtils";
import AddTemplatePopup, { TemplateFormData } from "../popups/AddTemplatePopup";

interface JSONViewProps {
  nodes: Node[];
  edges: Edge[];
  onChangeFlow: (nodes: Node[], edges: Edge[]) => void;
}

const JSONView: React.FC<JSONViewProps> = ({ nodes, edges, onChangeFlow }) => {
  const { t } = useTranslation("flow");
  const { onUpdateNodes } = useContext(NodeContext);
  const [showFieldsConfig, setShowFieldsConfig] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(true);
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

  const handleDeleteOutput = () => {
    const nodesCleared = clearAllOutput(nodes);
    onUpdateNodes(nodesCleared, edges);
  };

  const handleDeleteAll = () => {
    onUpdateNodes([], []);
  };

  const handleSaveAsTemplate = async (data: TemplateFormData) => {
    const nodesCleared = clearAllOutput(nodes);
    const flowData = convertFlowToJson(nodesCleared, edges, true, true);

    const template = {
      ...data,
      template: flowData,
    };

    let url = `${getRestApiUrl()}/template`;

    const response = await axios.post(url, template);
    console.log(response);
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
          <JSONViewButton onClick={handleDeleteOutput} dangerous>
            <FiCrosshair />
            {t("Delete Output")}
          </JSONViewButton>
          <JSONViewButton onClick={handleDeleteAll} dangerous>
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
  background-color: ${(props) => (props.dangerous ? "#e6816f" : "#72CCA5")};
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
