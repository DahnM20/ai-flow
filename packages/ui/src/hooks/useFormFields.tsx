import { useTranslation } from "react-i18next";
import {
  NodeLabel,
  NodeInput,
  NodeTextarea,
  NodeSelect,
  NodeSelectOption,
  OptionSelector,
  OptionButton,
  InputHandle,
} from "../components/nodes/Node.styles";
import InputNameBar from "../components/nodes/node-button/InputNameBar";
import { Field } from "../nodes-configuration/nodeConfig";
import React, { useEffect } from "react";
import Switch from "react-switch";
import { generateIdForHandle } from "../utils/flowUtils";
import { Position } from "reactflow";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export function useFormFields(
  data: any,
  id: string,
  handleNodeDataChange: (fieldName: string, value: any) => void,
  handleOptionChange: Function,
  setDefaultOption?: Function,
  textareaRef?: any,
  hasParent?: Function,
  specificField?: string,
  showHandles?: boolean,
  showOnlyConnectedFields?: boolean,
) {
  const { t } = useTranslation("flow");

  const getFields = () => {
    let fields;
    if (!!data?.config?.fields) {
      fields = data.config.fields;
    } else if (!!data?.dynamicValues?.fields) {
      fields = data.dynamicValues.fields;
    }
    return fields;
  };

  useEffect(() => {
    if (!setDefaultOption) return;

    const fields = getFields();
    fields?.forEach((field: Field) => {
      if (!data[field.name]) {
        setDefaultOption(field);
      }
    });
  }, []);

  const handleEventNodeDataChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleNodeDataChange(event.target.name, event.target.value);
  };

  const renderField = (field: Field, index: number) => {
    switch (field.type) {
      case "input":
        return (
          <NodeInput
            name={field.name}
            className="nodrag"
            defaultValue={data[field.name]}
            placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
            onChange={handleEventNodeDataChange}
          />
        );
      case "inputInt":
        return (
          <NodeInput
            name={field.name}
            className="nodrag"
            defaultValue={data[field.name]}
            placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
            onChange={(event) =>
              handleNodeDataChange(event.target.name, +event.target.value)
            }
          />
        );
      case "textarea":
        return (
          <NodeTextarea
            key={`${id}-${field.name}`}
            ref={textareaRef}
            name={field.name}
            className="nodrag nowheel"
            defaultValue={data[field.name]}
            placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
            onChange={handleEventNodeDataChange}
          />
        );
      case "select":
        return (
          <NodeSelect
            onChange={(e) => handleOptionChange(field.name, e.target.value)}
            defaultValue={data[field.name]}
          >
            {field.options?.map((option) => (
              <NodeSelectOption key={`${id}-${option.value}`}>
                {t(option.label)}
              </NodeSelectOption>
            ))}
          </NodeSelect>
        );
      case "option":
        return (
          <div className="my-1 flex w-full items-center justify-center">
            <OptionSelector key={`${id}-${field.name}`}>
              {field.options?.map((option) => (
                <OptionButton
                  key={`${id}-${option.value}`}
                  selected={data[field.name] === option.value}
                  onClick={() => handleOptionChange(field.name, option.value)}
                  onTouchEnd={() =>
                    handleOptionChange(field.name, option.value)
                  }
                >
                  {t(option.label)}
                </OptionButton>
              ))}
            </OptionSelector>
          </div>
        );
      case "inputNameBar":
        return (
          data.config.inputNames && (
            <InputNameBar
              key={`${id}-${field.name}`}
              inputNames={data.config.inputNames}
              textareaRef={textareaRef}
            />
          )
        );
      case "slider":
        return (
          <div className="flex w-full flex-row items-center justify-center">
            <p className="w-1/12 text-left text-sm text-blue-200">
              {data[field.name]}
            </p>
            <Slider
              className="nodrag w-11/12"
              defaultValue={data[field.name]}
              onChange={(value) => handleNodeDataChange(field.name, value)}
              onChangeComplete={(value) =>
                handleNodeDataChange(field.name, value)
              }
              styles={{
                track: {
                  backgroundColor: "rgba(94,209,232,0.85)",
                },
                handle: {
                  //borderColor: 'blue',
                  borderColor: "rgba(94,209,232,0.85)",
                  backgroundColor: "rgba(94,209,232,1)",
                },
                rail: {
                  backgroundColor: "rgba(54, 54, 54, 0.8)",
                },
              }}
              min={field.min}
              max={field.max}
              step={1}
            />
          </div>
        );
      case "boolean":
        return (
          <div className="flex w-full flex-row items-center">
            <Switch
              onChange={(checked: boolean) =>
                handleNodeDataChange(field.name, checked)
              }
              checked={data[field.name]}
              className="nodrag"
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={15}
              width={30}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const fields = getFields();

  if (!data || !data.config || !fields) {
    return null;
  }

  return fields
    .filter((field: Field) =>
      !!hasParent && hasParent(id) && field.hideIfParent != null
        ? !field.hideIfParent
        : true,
    )
    .filter((field: Field) =>
      specificField ? field.name === specificField : true,
    )
    .map((field: Field, index: number) => {
      if (showOnlyConnectedFields && !field.isLinked) {
        return null;
      }

      return (
        <React.Fragment key={`${id}-${field.name}`}>
          {field.label && showHandles && (
            <div className="flex flex-row items-center space-x-5">
              {field.hasHandle && (
                <InputHandle
                  className={`handle custom-handle`}
                  required={field.required}
                  type="target"
                  position={Position.Left}
                  id={generateIdForHandle(index)}
                />
              )}
              <NodeLabel
                className={`font-md
                                        ${field.isLinked ? "text-sky-400" : ""}  
                                        ${field.required ? "font-bold" : ""}`}
              >
                {t(field.name) + `${field.required ? " *" : ""}`}
              </NodeLabel>
            </div>
          )}
          {!field.isLinked && renderField(field, index)}
        </React.Fragment>
      );
    });
}
