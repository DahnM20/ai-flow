import { MouseEvent, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaOldRepublic } from "react-icons/fa";
import { NodeProps, Position, useUpdateNodeInternals } from "reactflow";
import { useFormFields } from "../../hooks/useFormFields";
import useHandlePositions from "../../hooks/useHandlePositions";
import useHandleShowOutput from "../../hooks/useHandleShowOutput";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import { useRefreshOnAppearanceChange } from "../../hooks/useRefreshOnAppearanceChange";
import { Field } from "../../nodesConfiguration/nodeConfig";
import { generateIdForHandle, getTargetHandleKey } from "../../utils/flowUtils";
import HandleWrapper from "../handles/HandleWrapper";
import SelectModelPopup from "../popups/selectModelPopup/SelectModelPopup";
import { NodeContext } from "../providers/NodeProvider";
import { NodeBand, NodeContainer, NodeContent, NodeForm, NodeHeader, NodeIcon, NodeInput, NodeLogs, NodeLogsText, NodeTitle } from "../shared/Node.styles";
import NodePlayButton from "../shared/node-button/NodePlayButton";
import styled from 'styled-components';
import { FiCopy } from 'react-icons/fi';
import ImageUrlOutput from '../shared/node-output/ImageUrlOutput';
import MarkdownOutput from '../shared/node-output/MarkdownOutput';
import VideoUrlOutput from '../shared/node-output/VideoUrlOutput';
import useCachedFetch from '../../hooks/useCachedFetch';
import { getRestApiUrl } from '../../utils/config';
import AudioUrlOutput from '../shared/node-output/AudioUrlOutput';
import { toastInfoMessage } from "../../utils/toastUtils";
import { convertOpenAPISchemaToNodeConfig, getSchemaFromConfig } from "../../utils/openAPIUtils";

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

    const [fields, setFields] = useState<Field[]>(!!data.config?.fields ? data.config.fields : [])
    const [model, setModel] = useState<string>(!!data.config?.nodeName ? data.config.nodeName : null)
    const [modelInput, setModelInput] = useState<string>("");

    const { getIncomingEdges, showOnlyOutput, isRunning, onUpdateNodeData } = useContext(NodeContext);

    const { t } = useTranslation('flow');
    const { fetchCachedData } = useCachedFetch();

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
            config: {
                ...data.config,
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

    const handleOptionChange = (name: string, value: string) => {
        onUpdateNodeData(id, {
            ...data,
            [name]: value,
        });
        updateNodeInternals(id);
    };

    const formFields = useFormFields(
        data,
        id,
        handleNodeDataChange,
        handleOptionChange,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        !collapsed
    );


    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handlePlayClick = () => {
        setIsPlaying(true);
    };


    useEffect(() => {

        async function getConfig() {
            try {
                const url = `${getRestApiUrl()}/node/replicate/config/${model}`;
                return await fetchCachedData(url, `${model}_config`, 600000, { processorType: data.processorType });
            } catch (error) {
                toastInfoMessage("Error fetching configuration for " + model)
                console.error('Error fetching configuration:', error);
                throw error;
            }
        }

        async function configureNode() {
            let config;
            let fields: Field[] = [];
            try {
                config = await getConfig()
                const inputSchema = getSchemaFromConfig(config, "Input")
                fields = convertOpenAPISchemaToNodeConfig(inputSchema, config)
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
            if (!config) return
            const modelId = config.modelId
            setModel(model + ':' + modelId)
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
                fields: fields,
                nodeName: model,
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

    function getOutputType(): string {
        if (!data.outputData || !data.lastRun) return "markdown"

        let outputData = data.outputData;
        let output = ""

        if (typeof (output) !== 'string') {
            output = outputData[0];
        } else {
            output = outputData[0];
        }


        const outputType = (output.endsWith(".png") || output.endsWith(".jpg"))
            ? "imageUrl"
            : (output.endsWith(".mp4") || output.endsWith(".mov"))
                ? "videoUrl"
                : (output.endsWith(".mp3") || output.endsWith(".wav"))
                    ? "audioUrl"
                    : "markdown";

        return outputType
    }


    function getOutputComponent(): any {
        if (!data.outputData || !data.lastRun) return <></>

        let outputData = data.outputData;
        let output = ""

        if (typeof (output) !== 'string') {
            output = outputData[0];
        } else {
            output = outputData[0];
        }


        switch (getOutputType()) {
            case 'imageUrl':
                return <ImageUrlOutput url={output} name={data.name} />
            case 'videoUrl':
                return <VideoUrlOutput url={output} name={data.name} />
            case 'audioUrl':
                return <AudioUrlOutput url={output} name={data.name} />
            default:
                return <MarkdownOutput data={output} />
        }
    }

    function handleLoadModel() {
        setModel(modelInput)
    }

    function handleCopyToClipboard(event: MouseEvent<SVGElement, globalThis.MouseEvent>) {

    }

    const outputType = getOutputType()

    const outputIsMedia = (outputType === 'imageUrl'
        || outputType === 'imageBase64'
        || outputType === 'videoUrl'
        || outputType === 'audioUrl') && !!data.outputData;

    const modelNameToDisplay = model?.includes(':') ? model.split(':')[0] : model;

    return (<NodeContainer key={nodeId} ref={nodeRef} >
        <NodeHeader onDoubleClick={toggleCollapsed}>
            <NodeIcon><FaOldRepublic /></NodeIcon>
            <NodeTitle className='px-5 overflow-hidden whitespace-nowrap text-ellipsis'>{modelNameToDisplay}</NodeTitle>
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
                        : <div className="flex flex-col space-y-2 w-full items-center justify-center">
                            <div className='flex flex-row w-2/3 items-center'>
                                <button
                                    className="bg-slate-600 hover:bg-slate-400 rounded-2xl px-3 py-2 w-full"
                                    onClick={handleButtonClick}
                                >
                                    {t('ClickToSelectModel')}
                                </button>
                                {
                                    showPopup
                                    && <SelectModelPopup show={showPopup} onClose={() => { setShowPopup(false) }} onValidate={handleValidate} />
                                }
                            </div>
                            <p> {t('Or')} </p>
                            <div className='flex flex-row  space-x-2 w-2/3'>
                                <NodeInput className='text-center'
                                    placeholder={t('EnterModelNameDirectly') ?? ''}
                                    onChange={(event) => setModelInput(event.target.value)} />
                                <button className='bg-sky-500 hover:bg-sky-400 p-2 rounded-lg' onClick={handleLoadModel}> {t('Load')} </button>
                            </div>
                        </div>
                }
            </NodeForm>
        </NodeContent>
        <NodeLogs
            showLogs={showLogs}
            noPadding={outputIsMedia && showLogs}
            onClick={() => setShowLogs(!showLogs)}
        >
            {showLogs && data.outputData && !outputIsMedia
                && <StyledCopyIcon className="copy-icon hover:text-white" onClick={(event) => {
                    handleCopyToClipboard(event);
                }} />}
            {!showLogs && data.outputData
                ? <NodeLogsText className='text-center'>{t('ClickToShowOutput')}</NodeLogsText>
                : getOutputComponent()}
        </NodeLogs>
    </NodeContainer>)
}

const StyledCopyIcon = styled(FiCopy)`
  position: absolute;
  right: 10px;
  cursor: pointer;
  z-index: 1;
  `;

