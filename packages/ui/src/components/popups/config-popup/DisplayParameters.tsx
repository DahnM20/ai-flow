import { useTranslation } from "react-i18next";
import { nodeConfigs } from "../../../nodes-configuration/nodeConfig";
import { ActionButton, Actions, ParametersContainer } from "./UserParameters";
import { Checkbox } from "@mantine/core";
import { useState } from "react";
import { getNodesHiddenList, saveNodesHiddenList } from "./parameters";
import { toastFastSuccessMessage } from "../../../utils/toastUtils";
import {
  getNonGenericNodeConfig,
  transformNodeConfigsToDndNode,
} from "../../../nodes-configuration/sectionConfig";
import { useVisibility } from "../../../providers/VisibilityProvider";

export default function DisplayParameters() {
  const { t } = useTranslation("flow");
  const { t: tc } = useTranslation("config");
  const { getElement } = useVisibility();

  const minimap = getElement("minimap");

  const [nodesHidden, setNodesHidden] =
    useState<string[]>(getNodesHiddenList());

  function handleCheckField(key: string): void {
    if (nodesHidden.includes(key)) {
      setNodesHidden(nodesHidden.filter((node) => node !== key));
    } else {
      setNodesHidden([...nodesHidden, key]);
    }
  }

  function handleSave(): void {
    saveNodesHiddenList(nodesHidden);
    toastFastSuccessMessage(tc("configUpdated"));
  }

  let allNodes = transformNodeConfigsToDndNode(nodeConfigs).concat(
    getNonGenericNodeConfig(),
  );

  const nodesBySection = allNodes.reduce((acc: Record<string, any[]>, node) => {
    const section = node.section || "Default";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(node);
    return acc;
  }, {});

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col">
        <ParametersContainer className="flex flex-col">
          <h3 className="mb-2 font-semibold">{tc("UI")}</h3>
          <Checkbox
            label={tc("ShowMinimap")}
            size="sm"
            darkHidden={false}
            color="cyan"
            checked={minimap.isVisible}
            onChange={() => minimap.toggle()}
          />

          <h3 className="mb-2 mt-10 font-semibold">{tc("Core Nodes")}</h3>

          <div className="flex flex-col gap-10 md:flex-row">
            {Object.keys(nodesBySection).map((section) => (
              <div key={section} className="mb-4">
                <h4 className="mb-2 text-sm italic">{tc(section)}</h4>
                <div
                  className="mb-5 flex w-full items-center justify-center"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {nodesBySection[section].map((node) => (
                    <Checkbox
                      key={node.type}
                      label={t(node.label ?? node.type)}
                      size="sm"
                      darkHidden={false}
                      color="cyan"
                      checked={!nodesHidden?.includes(node.type)}
                      onChange={() => handleCheckField(node.type)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ParametersContainer>
        <Actions>
          <ActionButton
            onClick={handleSave}
            className="bg-teal-500 hover:bg-teal-400"
          >
            {tc("validateButtonLabel")}
          </ActionButton>
        </Actions>
      </div>
    </div>
  );
}
