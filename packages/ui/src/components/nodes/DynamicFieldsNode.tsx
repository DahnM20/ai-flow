import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { NodeProps, Position, useUpdateNodeInternals } from "reactflow";
import axios from 'axios';
import { Field } from "../../nodesConfiguration/nodeConfig";
import { t } from "i18next";
import HandleWrapper from "../handles/HandleWrapper";
import { NodeContainer, NodeHeader, NodeIcon, NodeTitle, NodeBand, NodeContent, NodeForm, NodeLogs, NodeLogsText, NodeInput, NodeLabel, InputHandle } from "../shared/Node.styles";
import NodePlayButton from "../shared/nodes-parts/NodePlayButton";
import useHandleShowOutput from "../../hooks/useHandleShowOutput";
import { useRefreshOnAppearanceChange } from "../../hooks/useRefreshOnAppearanceChange";
import useHandlePositions from "../../hooks/useHandlePositions";
import { useTranslation } from "react-i18next";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import { generateIdForHandle, getTargetHandleKey } from "../../utils/flowUtils";
import { NodeContext } from "../providers/NodeProvider";
import { FaCog, FaOldRepublic } from "react-icons/fa";
import NodePopup from "../popups/NodePopup";
import { useFormFields } from "../../hooks/useFormFields";

interface DynamicFieldsNodeData {
    handles: any;
    id: string;
    name: string;
    schema: any;
    processorType: string;
    input: string;
    input_key: string;
    outputData?: string[];
    lastRun: string;
    [key: string]: any;
}

interface DynamicFieldsProps extends NodeProps {
    data: DynamicFieldsNodeData
}

export default function DynamicFieldsNode({ data, id, selected }: DynamicFieldsProps) {

    const [fields, setFields] = useState<Field[]>(!!data.dynamicValues?.fields ? data.dynamicValues.fields : [])
    const [model, setModel] = useState<string>(!!data.dynamicValues?.dynamicNodeModel ? data.dynamicValues.dynamicNodeModel : null)

    const { t } = useTranslation('flow');

    const { getIncomingEdges, showOnlyOutput, isRunning, onUpdateNodeData } = useContext(NodeContext);

    const updateNodeInternals = useUpdateNodeInternals();

    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [showLogs, setShowLogs] = useState<boolean>(true);
    const [nodeId, setNodeId] = useState<string>(`${data.name}-${Date.now()}`);
    const [isPlaying, setIsPlaying] = useIsPlaying();
    const [showPopup, setShowPopup] = useState(false);

    const outputHandleId = useMemo(() => generateIdForHandle(0, true), []);

    const nodeRef = useRef(null)

    const nbInput = useMemo(() => {
        return !!fields
            ? fields.length
            : 1;
    }, []);

    const { allHandlePositions } = useHandlePositions(data, nbInput, outputHandleId);

    useEffect(() => {
        setNodeId(`${data.name}-${Date.now()}`);
        setIsPlaying(false);
        updateNodeInternals(id);
    }, [data.lastRun]);

    useEffect(() => {
        const fieldsToNullify: any = {}

        const edgesKeys = getIncomingEdges(id)?.map((edge) => getTargetHandleKey(edge))

        edgesKeys?.forEach((key) => {
            fieldsToNullify[fields[key]?.name] = undefined
        })

        const fieldsUpdated = fields.map((field) => {
            if (field.name in fieldsToNullify) {
                field.isLinked = true
            } else {
                field.isLinked = false
            }
            return field
        })

        onUpdateNodeData(id, {
            ...data,
            ...fieldsToNullify,
            dynamicValues: {
                ...data.dynamicValues,
                fields: fieldsUpdated
            }
        });

        updateNodeInternals(id);
    }, [getIncomingEdges(id)?.length])

    useRefreshOnAppearanceChange(updateNodeInternals, id, [collapsed, showLogs]);

    useHandleShowOutput({
        showOnlyOutput,
        id: id,
        setCollapsed: setCollapsed,
        setShowLogs: setShowLogs,
        updateNodeInternals: updateNodeInternals
    });

    const handleNodeDataChange = (fieldName: string, value: any) => {
        onUpdateNodeData(id, {
            ...data,
            [fieldName]: value,
        });
        updateNodeInternals(id);
    };

    const formFields = useFormFields(
        data,
        id,
        handleNodeDataChange,
        () => { },
        () => { },
        undefined,
        () => { }
    );


    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    const getNodeTypeFrom = (prop: any) => {
        if (prop.maximum != null && prop.minimum != null) {
            return "slider"
        }

        if (prop.type === "boolean") return "boolean"

        return "input"
    }


    function convertOpenAPISchemaToNodeConfig(schema: any) {
        console.log(schema.properties)
        return Object.entries(schema.properties).map(([name, prop]: [string, any]) => {
            const field: Field = {
                name,
                type: getNodeTypeFrom(prop),
                label: prop.title,
                placeholder: prop.description,
                defaultValue: prop.default,
                max: prop.maximum,
                min: prop.minimum,
                hasHandle: true,
                isLinked: false,
            };

            return field;
        }).filter((field) => !!field.label);
    }

    useEffect(() => {

        async function getConfig() {
            try {
                const url = `http://localhost:5000/node/replicate/config/${model}`;
                const response = await axios.get(url, { params: { processorType: data.processorType } });
                console.log(response)
                return response.data;
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
        }

        async function configureNode() {
            const schema = await getConfig()
            const fields = convertOpenAPISchemaToNodeConfig(schema)
            console.log(fields)
            setFields(fields)
        }

        if (fields.length > 0 || !model) return;

        configureNode()

    }, [model])

    useEffect(() => {
        const newFieldData: any = {}

        fields.forEach((field) => {
            if (field.defaultValue != null) {
                if (data[field.name] == null && !field.isLinked) {
                    newFieldData[field.name] = field.defaultValue;
                }
            }
        })

        onUpdateNodeData(id, {
            ...data,
            ...newFieldData,
            config: {
                ...data.config,
                inputNames: fields.map((field) => field.name),
            },
            dynamicValues: {
                fields: fields,
                dynamicNodeModel: model
            }

        });
    }, [fields])

    const handleChangeHandlePosition = (newPosition: Position, handleId: string) => {
        onUpdateNodeData(id, {
            ...data,
            handles: {
                ...data.handles,
                [handleId]: newPosition
            }
        });
        updateNodeInternals(id);
    }

    const handleButtonClick = () => {
        setShowPopup(!showPopup);
    };

    const handleValidate = (data: any) => {
        setModel(data);
        setShowPopup(!showPopup);
    }


    return (<NodeContainer key={nodeId} ref={nodeRef} >
        <NodeHeader onDoubleClick={toggleCollapsed}>
            <NodeIcon><FaOldRepublic /></NodeIcon>
            <NodeTitle>{model}</NodeTitle>
            <HandleWrapper id={outputHandleId} position={
                !!data?.handles && data.handles[outputHandleId]
                    ? data.handles[outputHandleId]
                    : Position.Right}
                linkedHandlePositions={allHandlePositions}
                onChangeHandlePosition={handleChangeHandlePosition}
                isOutput />
            <NodePlayButton isPlaying={isPlaying} hasRun={!!data.lastRun} onClick={handlePlayClick} nodeName={data.name} />
        </NodeHeader>
        <NodeBand />
        <NodeContent>
            <NodeForm>
                {
                    fields.length > 0
                        ? formFields
                        : <div className="flex w-full items-center justify-center">
                            <button
                                className="bg-slate-600 hover:bg-slate-400 rounded-2xl p-3"
                                onClick={handleButtonClick}
                            >
                                Click to Select Model
                            </button>
                            {showPopup && <NodePopup show={showPopup} onClose={() => { setShowPopup(false) }} onValidate={handleValidate}>
                                <div> hi </div>
                            </NodePopup>
                            }
                        </div>
                }
            </NodeForm>
        </NodeContent>
    </NodeContainer>)
}

