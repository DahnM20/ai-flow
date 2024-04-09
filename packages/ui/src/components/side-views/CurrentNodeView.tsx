import React, { useContext, memo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { NodeContext } from "../../providers/NodeProvider";
import { useFormFields } from "../../hooks/useFormFields";
import { Field } from "../../nodes-configuration/nodeConfig";
import OutputDisplay from "../nodes/node-output/OutputDisplay";
import ExpandableBloc from "../selectors/ExpandableBloc";
import NodePlayButton from "../nodes/node-button/NodePlayButton";

interface CurrentNodeViewProps {}

const CurrentNodeView: React.FC<CurrentNodeViewProps> = () => {
  const { t } = useTranslation("flow");
  const { onUpdateNodeData, currentNodeIdSelected, findNode, hasParent } =
    useContext(NodeContext);

  const node = findNode(currentNodeIdSelected);

  const handleNodeDataChange = (fieldName: string, value: any) => {
    if (!node) return;
    onUpdateNodeData(node.id, {
      ...node.data,
      [fieldName]: value,
    });
  };

  function setDefaultOptions() {
    if (!node || !node.data.config.fields) return;
    const defaultOptions: any = {};
    node.data.config.fields
      .filter(
        (field: Field) =>
          field.options?.find((option) => option.default) &&
          !node.data[field.name],
      )
      .forEach((field: Field) => {
        defaultOptions[field.name] = field.options?.find(
          (option) => option.default,
        )?.value;
      });

    onUpdateNodeData(node.id, {
      ...node.data,
      ...defaultOptions,
    });
  }

  const formFields = useFormFields(
    node?.data,
    node?.id ?? "",
    handleNodeDataChange,
    setDefaultOptions,
    hasParent,
    {
      showHandles: false,
      showLabels: true,
    },
  );

  if (!currentNodeIdSelected)
    return (
      <ViewContainer className="space-y-2 text-center">
        <p>{t("NoNodeSelected")}</p>
      </ViewContainer>
    );

  return (
    <>
      <ViewContainer className="space-y-2">
        <div className="mb-4 flex flex-col items-center justify-center">
          <div className="flex flex-row space-x-3">
            <p className="text-lg font-bold text-sky-100">
              {t(node?.data.config?.nodeName)}
            </p>
            <NodePlayButton nodeName={currentNodeIdSelected} />
          </div>
          <p className="mt-1 rounded-md bg-zinc-600/30 px-2 py-1 text-sm">
            {currentNodeIdSelected}
          </p>
        </div>
        {!!formFields && (
          <div className="flex flex-col space-y-3">
            <ExpandableBloc title={t("Parameters")} defaultOpen>
              <div className="space-y-1 px-1">{formFields}</div>
            </ExpandableBloc>
          </div>
        )}
        {!!node?.data.outputData && (
          <div className="flex flex-col space-y-3">
            <ExpandableBloc title={t("Output")} defaultOpen>
              <OutputDisplay data={node?.data} />
            </ExpandableBloc>
          </div>
        )}
      </ViewContainer>
    </>
  );
};

const ViewContainer = styled.div`
  padding: 20px;
`;

export default memo(CurrentNodeView);
