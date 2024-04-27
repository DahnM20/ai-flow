import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NodeProps } from "reactflow";
import { Field } from "../../nodes-configuration/types";
import SelectModelPopup from "../popups/select-model-popup/SelectModelPopup";
import { NodeContainer } from "./Node.styles";
import {
  convertOpenAPISchemaToNodeConfig,
  getSchemaFromConfig,
} from "../../utils/openAPIUtils";
import { NodeData } from "./types/node";
import InputWithButton from "../inputs/InputWithButton";
import withCache from "../../api/cache/withCache";
import { toastErrorMessage } from "../../utils/toastUtils";
import GenericNode from "./GenericNode";
import { NodeContext } from "../../providers/NodeProvider";
import { getModelConfig } from "../../api/nodes";

interface ReplicateNodeData extends NodeData {
  schema: any;
}

interface DynamicFieldsProps extends NodeProps {
  data: ReplicateNodeData;
}

export default function DynamicAPINode({
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
  const [model, setModel] = useState<string | undefined>(
    !!data.config?.nodeName
      ? data.config.nodeName
      : "16196421416d3730b3076e94eee4dee5c3aad5a8e55bad7b8be38f46ef28dfc4",
  );

  //63c0ad06527873fd9d151d2eb377f11d23055c2ca15e77e7ec72a5d73ca71225
  //92cc6cff619ba54689efcd243134ba61e89112053f28be98fad62fd761e7cf95
  //75b0fd8aec5653a1b8628783b792e11d65809ba33475362d7b01eafb7990b138
  //16196421416d3730b3076e94eee4dee5c3aad5a8e55bad7b8be38f46ef28dfc4
  const [fields, setFields] = useState<Field[]>(
    !!data.config?.fields ? data.config.fields : [],
  );

  const [showPopup, setShowPopup] = useState(false);

  const { onUpdateNodeData } = useContext(NodeContext);

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
      if (!model) return;
      let config;
      let fields: Field[] = [];
      try {
        config = await withCache(getModelConfig, "stabilityai", model);
        fields = convertOpenAPISchemaToNodeConfig(config, config);
      } catch (error) {
        console.error("Error fetching configuration:", error);
        toastErrorMessage(
          `Error fetching configuration for following model : "${model}". \n\n Here's a valid model name as an example : fofr/become-image `,
        );
      }
      if (!config) return;
      setModel(model);
      setFields(fields);

      const modelNameToDisplay = model?.includes(":")
        ? model.split(":")[0]
        : model;

      const newFieldData: any = getNewFieldData(fields);

      onUpdateNodeData(id, {
        ...data,
        ...newFieldData,
        model: model,
        config: {
          ...data.config,
          fields,
          inputNames: fields.map((field) => field.name),
          showHandlesNames: true,
          nodeName: modelNameToDisplay,
        },
        nodeLoaded: true,
      });
    }

    if (fields.length > 0 || !model) return;

    configureNode();
  }, [model]);

  useEffect(() => {
    const newFieldData: any = getNewFieldData(fields);

    onUpdateNodeData(id, {
      ...data,
      ...newFieldData,
      config: {
        ...data.config,
        inputNames: fields.map((field) => field.name),
        fields: fields,
      },
    });
  }, [fields]);

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
    setModel(model);
    setShowPopup(!showPopup);
  };

  function handleLoadModel() {
    setModel(modelInput);
  }

  return !data.nodeLoaded ? (
    <NodeContainer
      key={id}
      className={`flex h-full w-full flex-col items-center justify-center px-4 py-5 text-slate-100`}
    >
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
      nodeFields={fields}
    />
  );
}
