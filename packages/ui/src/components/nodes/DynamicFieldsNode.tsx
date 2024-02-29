import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaWaveSquare } from "react-icons/fa";
import { NodeProps, Position, useUpdateNodeInternals } from "reactflow";
import { useFormFields } from "../../hooks/useFormFields";
import useHandlePositions from "../../hooks/useHandlePositions";
import useHandleShowOutput from "../../hooks/useHandleShowOutput";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import { Field } from "../../nodes-configuration/nodeConfig";
import { generateIdForHandle, getTargetHandleKey } from "../../utils/flowUtils";
import HandleWrapper from "../handles/HandleWrapper";
import SelectModelPopup from "../popups/select-model-popup/SelectModelPopup";
import { NodeContext } from "../../providers/NodeProvider";
import {
  NodeBand,
  NodeContainer,
  NodeContent,
  NodeForm,
  NodeHeader,
  NodeIcon,
  NodeTitle,
} from "./Node.styles";
import NodePlayButton from "./node-button/NodePlayButton";
import {
  convertOpenAPISchemaToNodeConfig,
  getSchemaFromConfig,
} from "../../utils/openAPIUtils";
import { NodeData } from "./types/node";
import NodeOutput from "./node-output/NodeOutput";
import InputWithButton from "../inputs/InputWithButton";
import { getModelConfig } from "../../api/replicateModels";
import withCache from "../../api/cache/withCache";
import { toastErrorMessage } from "../../utils/toastUtils";

interface DynamicFieldsNodeData extends NodeData {
  schema: any;
}

interface DynamicFieldsProps extends NodeProps {
  data: DynamicFieldsNodeData;
}

export default function DynamicFieldsNode({
  data,
  id,
  selected,
}: DynamicFieldsProps) {
  const { t } = useTranslation("flow");

  const { getIncomingEdges, showOnlyOutput, onUpdateNodeData } =
    useContext(NodeContext);

  const [fields, setFields] = useState<Field[]>(
    !!data.config?.fields ? data.config.fields : [],
  );
  const [model, setModel] = useState<string | undefined>(
    !!data.config?.nodeName ? data.config.nodeName : undefined,
  );
  const [modelInput, setModelInput] = useState<string>("");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useIsPlaying();
  const [showPopup, setShowPopup] = useState(false);

  const nodeRef = useRef(null);

  const outputHandleId = useMemo(() => generateIdForHandle(0, true), []);
  const nbInput = useMemo(() => {
    return !!fields ? fields.length : 1;
  }, []);

  const updateNodeInternals = useUpdateNodeInternals();

  const { allHandlePositions } = useHandlePositions(
    data,
    nbInput,
    outputHandleId,
  );

  useHandleShowOutput({
    showOnlyOutput,
    setCollapsed: setCollapsed,
    setShowLogs: setShowLogs,
  });

  useEffect(() => {
    if (data.isDone) setIsPlaying(false);

    updateNodeInternals(id);
  }, [data.lastRun]);

  useEffect(() => {
    const fieldsToNullify: any = {};

    const edgesKeys = getIncomingEdges(id)?.map((edge) =>
      getTargetHandleKey(edge),
    );

    edgesKeys?.forEach((key) => {
      fieldsToNullify[fields[key]?.name] = undefined;
    });

    const fieldsUpdated = fields.map((field) => {
      if (field.name in fieldsToNullify) {
        field.isLinked = true;
      } else {
        field.isLinked = false;
      }
      return field;
    });

    onUpdateNodeData(id, {
      ...data,
      ...fieldsToNullify,
      config: {
        ...data.config,
        fields: fieldsUpdated,
      },
    });
  }, [getIncomingEdges(id)?.length]);

  const handleNodeDataChange = (fieldName: string, value: any) => {
    onUpdateNodeData(id, {
      ...data,
      [fieldName]: value,
    });
  };

  const formFields = useFormFields(
    data,
    id,
    handleNodeDataChange,
    undefined,
    undefined,
    undefined,
    true,
    collapsed,
  );

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    async function configureNode() {
      if (!model) return;
      let config;
      let fields: Field[] = [];
      try {
        config = await withCache(getModelConfig, model, data.processorType);
        const inputSchema = getSchemaFromConfig(config, "Input");
        fields = convertOpenAPISchemaToNodeConfig(inputSchema, config);
      } catch (error) {
        toastErrorMessage(`Error fetching configuration: ${error}`);
      }
      if (!config) return;
      const modelId = config.modelId;
      setModel(model + ":" + modelId);
      setFields(fields);
    }

    if (fields.length > 0 || !model) return;

    configureNode();
  }, [model]);

  useEffect(() => {
    const newFieldData: any = {};

    fields.forEach((field) => {
      if (field.defaultValue != null) {
        if (data[field.name] == null && !field.isLinked) {
          newFieldData[field.name] = field.defaultValue;
        }
      }
    });

    onUpdateNodeData(id, {
      ...data,
      ...newFieldData,
      config: {
        ...data.config,
        inputNames: fields.map((field) => field.name),
        fields: fields,
        nodeName: model,
      },
    });
  }, [fields]);

  const handleChangeHandlePosition = (
    newPosition: Position,
    handleId: string,
  ) => {
    onUpdateNodeData(id, {
      ...data,
      handles: {
        ...data.handles,
        [handleId]: newPosition,
      },
    });
    updateNodeInternals(id);
  };

  const handleButtonClick = () => {
    setShowPopup(!showPopup);
  };

  const handleValidate = (data: any) => {
    setModel(data);
    setShowPopup(!showPopup);
  };

  function handleLoadModel() {
    setModel(modelInput);
  }

  function handleClosePopup() {
    setShowPopup(false);
  }

  const modelNameToDisplay = model?.includes(":") ? model.split(":")[0] : model;

  const hasFieldToDisplay = formFields?.some((field: any) => field != null);

  return (
    <NodeContainer
      key={id}
      ref={nodeRef}
      className={`flex h-full w-full flex-col`}
    >
      <NodeHeader onDoubleClick={toggleCollapsed}>
        <NodeIcon>
          <FaWaveSquare />
        </NodeIcon>
        <NodeTitle className="overflow-hidden text-ellipsis whitespace-nowrap px-5">
          {modelNameToDisplay}
        </NodeTitle>
        <HandleWrapper
          id={outputHandleId}
          position={
            !!data?.handles && data.handles[outputHandleId]
              ? data.handles[outputHandleId]
              : Position.Right
          }
          linkedHandlePositions={allHandlePositions}
          onChangeHandlePosition={handleChangeHandlePosition}
          isOutput
        />
        <NodePlayButton
          isPlaying={isPlaying}
          hasRun={!!data.lastRun}
          onClick={handlePlayClick}
          nodeName={data.name}
        />
      </NodeHeader>
      <NodeBand />
      {(!collapsed || hasFieldToDisplay) && (
        <NodeContent>
          <NodeForm>
            {fields.length > 0 ? (
              formFields
            ) : (
              <div className="flex w-full flex-col items-center justify-center space-y-2">
                <div className="flex w-2/3 flex-row items-center">
                  <button
                    className="w-full rounded-2xl bg-slate-600 px-3 py-2 hover:bg-slate-400"
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
                    onInputChange={setModelInput}
                    onButtonClick={handleLoadModel}
                    inputClassName="text-center"
                    buttonClassName="rounded-lg bg-sky-500 p-2 hover:bg-sky-400"
                  />
                </div>
              </div>
            )}
          </NodeForm>
        </NodeContent>
      )}
      <NodeOutput
        showLogs={showLogs}
        onClickOutput={() => setShowLogs(!showLogs)}
        data={data}
      />
    </NodeContainer>
  );
}
