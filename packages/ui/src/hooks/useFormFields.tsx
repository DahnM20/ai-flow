import { useTranslation } from "react-i18next";
import { NodeLabel, NodeInput, NodeTextarea, NodeSelect, NodeSelectOption, OptionSelector, OptionButton, InputHandle } from "../components/shared/Node.styles";
import InputNameBar from "../components/shared/nodes-parts/InputNameBar";
import { Field } from "../nodesConfiguration/nodeConfig";
import React, { useEffect } from "react";
import Switch from "react-switch";
import { generateIdForHandle } from "../utils/flowUtils";
import { Position } from "reactflow";


export function useFormFields(data: any,
    id: string,
    handleNodeDataChange: (fieldName: string, value: any) => void,
    handleOptionChange: Function,
    setDefaultOption: Function,
    textareaRef: any,
    hasParent: Function,
    specificField?: string) {

    const { t } = useTranslation('flow');


    const getFields = () => {
        let fields;
        if (!!data?.config?.fields) {
            fields = data.config.fields
        } else if (!!data?.dynamicValues?.fields) {
            fields = data.dynamicValues.fields
        }
        return fields;
    }

    useEffect(() => {
        const fields = getFields()
        fields?.forEach((field: Field) => {
            if (!data[field.name]) {
                setDefaultOption(field);
            }
        });
    }, [])



    const handleEventNodeDataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleNodeDataChange(event.target.name, event.target.value);
    };


    const fields = getFields()

    if (!data || !data.config || !fields) {
        return <></>
    }

    return fields
        .filter((field: Field) => hasParent(id) && field.hideIfParent != null ? !field.hideIfParent : true)
        .filter((field: Field) => specificField ? field.name === specificField : true)
        .map((field: Field, index: number) => {
            const renderField = () => {
                switch (field.type) {
                    case 'input':
                        return (
                            <NodeInput
                                name={field.name}
                                className="nodrag"
                                defaultValue={data[field.name]}
                                placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
                                onChange={handleEventNodeDataChange}
                            />
                        );
                    case 'textarea':
                        return (
                            <NodeTextarea
                                key={`${id}-${field.name}`}
                                ref={textareaRef}
                                name={field.name}
                                className="nodrag"
                                defaultValue={data[field.name]}
                                placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
                                onChange={handleEventNodeDataChange}
                            />
                        );
                    case 'select':
                        return (
                            <NodeSelect
                                onChange={(e) => handleOptionChange(field.name, e.target.value)}
                                defaultValue={data[field.name]}
                            >
                                {field.options?.map(option => (
                                    <NodeSelectOption key={`${id}-${option.value}`}>
                                        {t(option.label)}
                                    </NodeSelectOption>
                                ))}
                            </NodeSelect>
                        );
                    case 'option':
                        return (
                            <div className="flex w-full items-center justify-center my-1">
                                <OptionSelector key={`${id}-${field.name}`}>
                                    {field.options?.map(option => (
                                        <OptionButton
                                            key={`${id}-${option.value}`}
                                            selected={data[field.name] === option.value}
                                            onClick={() => handleOptionChange(field.name, option.value)}
                                        >
                                            {t(option.label)}
                                        </OptionButton>
                                    ))}
                                </OptionSelector>
                            </div>
                        );
                    case 'inputNameBar':
                        return (
                            data.config.inputNames && <InputNameBar key={`${id}-${field.name}`} inputNames={data.config.inputNames} textareaRef={textareaRef} />
                        );
                    case 'slider':
                        return (
                            <div className="flex flex-row items-center w-full px-4">
                                <input
                                    type="range"
                                    className="w-full nodrag"
                                    name={field.name}
                                    defaultValue={data[field.name]}
                                    onChange={handleEventNodeDataChange}
                                    min={field.min}
                                    max={field.max}
                                    step={1}
                                />
                            </div>
                        )
                    case 'boolean':
                        return (
                            <div className="flex flex-row items-center w-full px-4">
                                <Switch onChange={(checked: boolean) => handleNodeDataChange(field.name, checked)} checked={data[field.name]} className="nodrag"
                                    onColor="#86d3ff"
                                    onHandleColor="#2693e6"
                                    handleDiameter={30}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={20}
                                    width={48} />
                            </div>
                        )
                    default:
                        return null;
                }
            };

            return (
                <React.Fragment key={`${id}-${field.name}`}>
                    {field.label && (
                        <div className="flex flex-row items-center space-x-5">
                            <InputHandle
                                className="handle custom-handle"
                                type="target"
                                position={Position.Left}
                                id={generateIdForHandle(index)}
                            />
                            <NodeLabel className={`${field.isLinked ? "text-sky-400" : ""}`}>
                                {t(field.name)}
                            </NodeLabel>
                        </div>
                    )}
                    {!field.isLinked && renderField()}
                </React.Fragment>
            );
        });
}