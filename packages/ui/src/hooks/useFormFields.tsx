import { useTranslation } from "react-i18next";
import { NodeLabel, NodeInput, NodeTextarea, NodeSelect, NodeSelectOption, OptionSelector, OptionButton } from "../components/shared/Node.styles";
import InputNameBar from "../components/shared/nodes-parts/InputNameBar";
import { Field } from "../nodesConfiguration/nodeConfig";
import { useEffect } from "react";


export function useFormFields(data: any,
    id: string,
    handleNodeDataChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleOptionChange: Function,
    setDefaultOption: Function,
    textareaRef: any,
    hasParent: Function,
    specificField?: string) {

    const { t } = useTranslation('flow');

    useEffect(() => {
        data?.config.fields.forEach((field: Field) => {
            if (!data[field.name]) {
                setDefaultOption(field);
            }
        });
    }, [])


    if (!data || !data.config || !data.config.fields) {
        return <></>
    }

    return data.config.fields
        .filter((field: Field) => hasParent(id) && field.hideIfParent != null ? !field.hideIfParent : true)
        .filter((field: Field) => specificField ? field.name === specificField : true)
        .map((field: Field) => {
            switch (field.type) {
                case 'input':
                    return (
                        <>
                            {
                                field.label &&
                                <NodeLabel key={`${id}-${field.name}`} >{t(field.label)}</NodeLabel>
                            }
                            <NodeInput key={`${id}-${field.name}`} name={field.name} className="nodrag" defaultValue={data[field.name]} placeholder={field.placeholder ? String(t(field.placeholder)) : ""} onChange={handleNodeDataChange} />
                        </>
                    );

                case 'textarea':
                    return (
                        <>
                            {
                                field.label &&
                                <NodeLabel key={`${id}-${field.name}`}>{t(field.label)}</NodeLabel>
                            }
                            <NodeTextarea key={`${id}-${field.name}`} ref={textareaRef} name={field.name} className="nodrag" defaultValue={data[field.name]} placeholder={field.placeholder ? String(t(field.placeholder)) : ""} onChange={handleNodeDataChange} />
                        </>
                    );
                case 'select':
                    return (
                        <>
                            <NodeSelect onChange={(e) => handleOptionChange(field.name, e.target.value)} defaultValue={data[field.name]}>
                                {field.options?.map(option => (
                                    <NodeSelectOption key={`${id}-${option.value}`} >
                                        {t(option.label)}
                                    </NodeSelectOption>
                                ))}
                            </NodeSelect>
                        </>
                    );
                case 'option':
                    return (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
                                <OptionSelector>
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
                        </>
                    );

                case 'inputNameBar':
                    return (
                        !!data.config.inputNames
                        && <InputNameBar inputNames={data.config.inputNames} textareaRef={textareaRef} />
                    );
            }
        });
}