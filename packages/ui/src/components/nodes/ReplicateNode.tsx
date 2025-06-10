import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NodeProps } from "reactflow";
import { Field } from "../../nodes-configuration/types";
import { LoadingSpinner, NodeContainer } from "./Node.styles";
import { NodeData } from "./types/node";
import InputWithButton from "../inputs/InputWithButton";
import { getModelConfig } from "../../api/replicateModels";
import withCache from "../../api/cache/withCache";
import { toastErrorMessage } from "../../utils/toastUtils";
import GenericNode from "./GenericNode";
import { NodeContext } from "../../providers/NodeProvider";
import { getIconComponent } from "./utils/NodeIcons";
import SelectModelPopup from "../popups/select-model-popup/SelectModelPopup";
import {
  getSchemaFromConfig,
  convertOpenAPISchemaToNodeConfig,
} from "../../utils/openAPIUtils";

interface ReplicateNodeData extends NodeData {
  schema: any;
}

interface DynamicFieldsProps extends NodeProps {
  data: ReplicateNodeData;
}

export default function ReplicateNode({
  data,
  id,
  selected,
  isConnectable,
  type,
  xPos,
  yPos,
  zIndex,
}: DynamicFieldsProps) {
  const { t } = useTranslation("flow");
  const [modelInput, setModelInput] = useState<string>("");

  const modelRef = useRef<string | undefined>(
    !!data.config?.nodeName ? data.config.nodeName : undefined,
  );

  const fieldsRef = useRef<Field[]>(
    !!data.config?.fields ? data.config.fields : [],
  );

  const [showPopup, setShowPopup] = useState(false);

  const { onUpdateNodeData, findNode } = useContext(NodeContext);

  function arrangeOldConfig() {
    onUpdateNodeData(id, {
      ...data,
      nodeLoaded: true,
      model: data.config.nodeName,
      config: {
        ...data.config,
        showHandlesNames: true,
        nodeName: data.config?.nodeName.split(":")[0],
      },
    });
  }

  useEffect(() => {
    if (
      !!data?.config?.fields &&
      !!data?.config?.nodeName &&
      !data.nodeLoaded
    ) {
      arrangeOldConfig();
    }
  });

  useEffect(() => {
    async function configureNode() {
      if (!modelRef.current) return;
      let response;
      let fields: Field[] = [];
      try {
        response = await withCache(
          getModelConfig,
          modelRef.current,
          data.processorType,
        );
        const inputSchema = getSchemaFromConfig(response, "Input");
        fields = convertOpenAPISchemaToNodeConfig(inputSchema, response);
      } catch (error) {
        toastErrorMessage(
          `Error fetching configuration for following model : "${modelRef.current}". \n\n Here's a valid model name as an example : fofr/become-image `,
        );
      }
      if (!response) return;

      const modelId = response.modelId;
      modelRef.current = modelRef.current + ":" + modelId;

      fieldsRef.current = fields;

      const modelNameToDisplay = modelRef.current?.includes(":")
        ? modelRef.current.split(":")[0]
        : modelRef.current;

      const newFieldData: any = getNewFieldData(fieldsRef.current);

      onUpdateNodeData(id, {
        ...data,
        ...newFieldData,
        model: modelRef.current,
        config: {
          ...data.config,
          fields: fieldsRef.current,
          inputNames: fields.map((field) => field.name),
          showHandlesNames: true,
          nodeName: modelNameToDisplay,
        },
        nodeLoaded: true,
      });
    }

    if (fieldsRef.current.length > 0 || !modelRef.current) return;

    configureNode();
  }, [modelRef.current]);

  useEffect(() => {
    if (!fieldsRef.current || fieldsRef.current.length === 0) return;

    const newFieldData: any = getNewFieldData(fieldsRef.current);

    const currentNodeData = findNode(id)?.data;

    onUpdateNodeData(id, {
      ...currentNodeData,
      ...newFieldData,
      config: {
        ...currentNodeData.config,
        inputNames: fieldsRef.current.map((field) => field.name),
        fields: fieldsRef.current,
      },
    });
  }, [fieldsRef.current]);

  function getNewFieldData(fields: Field[]) {
    const newFieldData: any = {};

    fields.forEach((field) => {
      if (field.defaultValue != null) {
        if (data[field.name] == null && !field.isLinked) {
          newFieldData[field.name] = field.defaultValue;
        }
      }
    });
    return newFieldData;
  }

  function handleClosePopup() {
    setShowPopup(false);
  }

  const handleButtonClick = () => {
    setShowPopup(!showPopup);
  };

  const handleValidate = (model: any) => {
    modelRef.current = model;
    setShowPopup(!showPopup);
  };

  function handleLoadModel() {
    modelRef.current = modelInput;
  }

  const NodeIconComponent = getIconComponent("ReplicateLogo");

  return !data.nodeLoaded ? (
    <NodeContainer
      key={id}
      className={`flex h-full w-full flex-col items-center justify-center px-4 py-5 text-slate-100`}
    >
      {!modelRef.current ? (
        <div className="flex w-full flex-col items-center justify-center space-y-3">
          <div className="flex w-full flex-row items-center">
            <button
              className="w-full rounded-2xl bg-slate-600 px-3 py-3 hover:bg-slate-400"
              onClick={handleButtonClick}
            >
              {t("ClickToSelectModel")}
            </button>
            {showPopup && (
              <SelectModelPopup
                show={showPopup}
                onClose={handleClosePopup}
                onValidate={handleValidate}
              />
            )}
          </div>
          <p> {t("Or")} </p>
          <div className="w-full text-slate-200">
            <InputWithButton
              buttonText={t("Load") ?? ""}
              inputPlaceholder={t("EnterModelNameDirectly") ?? ""}
              value={modelInput}
              onInputChange={setModelInput}
              onButtonClick={handleLoadModel}
              inputClassName="text-center"
              buttonClassName="rounded-lg bg-sky-500 p-2 hover:bg-sky-400"
            />
          </div>
        </div>
      ) : (
        <>
          <LoadingSpinner />
        </>
      )}
    </NodeContainer>
  ) : (
    <GenericNode
      data={data}
      id={id}
      selected={selected}
      type={type}
      zIndex={zIndex}
      isConnectable={isConnectable}
      xPos={xPos}
      yPos={yPos}
      dragging={false}
      nodeFields={fieldsRef.current}
      iconComponent={NodeIconComponent}
    />
  );
}
