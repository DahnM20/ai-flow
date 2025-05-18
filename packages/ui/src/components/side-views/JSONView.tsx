import React, { useContext, memo, useState, useEffect } from "react";
import {
  FiCloud,
  FiCrosshair,
  FiDownload,
  FiSave,
  FiUpload,
} from "react-icons/fi";
import { Edge, Node } from "reactflow";
import {
  clearSelectedNodes,
  convertFlowToJson,
  convertJsonToFlow,
  nodesTopologicalSort,
} from "../../utils/flowUtils";
import { useTranslation } from "react-i18next";
import { NodeContext } from "../../providers/NodeProvider";
import { FaExclamationTriangle } from "react-icons/fa";
import { isDev } from "../../config/config";
import { Button, Group, Switch } from "@mantine/core";
import { MdCopyAll } from "react-icons/md";
import "react18-json-view/src/style.css";
import "react18-json-view/src/dark.css";
import JsonViewLib from "react18-json-view";

interface JSONViewProps {
  nodes: Node[];
  edges: Edge[];
  onChangeFlow: (nodes: Node[], edges: Edge[]) => void;
}

const JSONView: React.FC<JSONViewProps> = ({ nodes, edges, onChangeFlow }) => {
  const { t } = useTranslation("flow");
  const { removeAll, clearAllOutput } = useContext(NodeContext);
  const [showFieldsConfig, setShowFieldsConfig] = useState(isDev());
  const [showCoordinates, setShowCoordinates] = useState(isDev());

  // Sort and convert nodes and edges to JSON
  const sortedNodes = nodesTopologicalSort(nodes, edges);
  const data = convertFlowToJson(
    sortedNodes,
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

  // Handle file download
  const handleDownloadClick = () => {
    const fullData = convertFlowToJson(sortedNodes, edges, true, true);
    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flow.json";
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  };

  return (
    <>
      <div className="space-y-4 p-3">
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="light"
            color="blue"
            leftSection={<FiUpload />}
            onClick={handleUploadClick}
          >
            {t("Upload")}
          </Button>
          <Button
            variant="light"
            color="green"
            leftSection={<FiDownload />}
            onClick={handleDownloadClick}
          >
            {t("Download")}
          </Button>
          <Button
            variant="light"
            color="orange"
            leftSection={<FiCrosshair />}
            onClick={clearAllOutput}
          >
            {t("DeleteOutputs")}
          </Button>
          <Button
            variant="light"
            color="red"
            leftSection={<FaExclamationTriangle />}
            onClick={removeAll}
          >
            {t("DeleteAll")}
          </Button>
        </div>

        {/* Switches */}
        <div className="flex flex-col space-y-2">
          <Group p="left">
            <Switch
              checked={showFieldsConfig}
              onChange={(event) =>
                setShowFieldsConfig(event.currentTarget.checked)
              }
              label={t("ShowNodesConfig")}
            />
          </Group>
          <Group p="left">
            <Switch
              checked={showCoordinates}
              onChange={(event) =>
                setShowCoordinates(event.currentTarget.checked)
              }
              label={t("ShowCoordinates")}
            />
          </Group>
        </div>

        {/* JSON Viewer */}
        <div className="relative w-full">
          <div className="absolute right-3 top-3 text-lg text-slate-500 transition-all duration-150 ease-in-out hover:text-slate-100">
            <MdCopyAll
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(data, null, 2))
              }
            />
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="relative w-full">
          {isDev() && (
            <div className="text-af-text-element-3 absolute right-3 top-3 text-lg transition-all duration-150 ease-in-out hover:text-slate-100">
              <MdCopyAll
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                }
              />
            </div>
          )}
          <JsonViewLib
            src={data}
            className="mt-5 rounded-xl bg-[#1E1E1E] p-2"
            theme="vscode"
            collapsed={isDev() ? 2 : 1}
            dark={true}
            enableClipboard={false}
          />
        </div>
      </div>
    </>
  );
};

export default memo(JSONView);
