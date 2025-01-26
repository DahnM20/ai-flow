import { useTranslation } from "react-i18next";
import { OptionSelector, OptionButton } from "../components/nodes/Node.styles";
import InputNameBar from "../components/nodes/node-button/InputNameBar";
import { Field } from "../nodes-configuration/types";
import React, { useCallback, useEffect, useRef } from "react";
import { generateIdForHandle } from "../utils/flowUtils";
import { Pill, PillsInput, Slider } from "@mantine/core";
import { Switch } from "@mantine/core";
import NodeField from "../components/nodes/node-input/NodeField";
import SelectAutocomplete from "../components/selectors/SelectAutocomplete";
import NodeTextField from "../components/nodes/node-input/NodeTextField";
import useIsTouchDevice from "./useIsTouchDevice";
import _ from "lodash";
import NodeTextarea from "../components/nodes/node-input/NodeTextarea";

export interface DisplayParams {
  showHandles?: boolean;
  showLabels?: boolean;
  showOnlyConnectedFields?: boolean;
  specificFields?: string[];
}

export function useFormFields(
  data: any,
  id: string,
  handleNodeDataChange: (fieldName: string, value: any, target?: any) => void,
  setDefaultOptions?: Function,
  hasParent?: Function,
  displayParams?: DisplayParams,
) {
  const { t } = useTranslation("flow");
  const isTouchDevice = useIsTouchDevice();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (!setDefaultOptions) return;
    setDefaultOptions();
  }, []);

  const handleEventNodeDataChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleNodeDataChange(event.target.name, event.target.value, event.target);
  };

  function calculateStep(min?: number, max?: number) {
    if (min == null || max == null) return 1;

    const range = max - min;
    let step;

    if (range <= 1) {
      step = 0.01;
    } else if (range <= 10) {
      step = 0.1;
    } else if (range <= 100) {
      step = 1;
    } else if (range <= 1000) {
      step = 10;
    } else {
      step = 100;
    }

    return step;
  }
  const renderField = (field: Field) => {
    switch (field.type) {
      case "textToDisplay":
        return <p>{field.defaultValue}</p>;
      case "input":
      case "textfield":
        return (
          <NodeTextField
            value={data[field.name]}
            placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
            isTouchDevice={isTouchDevice}
            onChange={(event) => {
              handleNodeDataChange(
                field.name,
                event.target.value,
                event.target,
              );
            }}
            onChangeValue={(value) => {
              handleNodeDataChange(field.name, value);
            }}
            fieldName={field?.name}
            withEditPopup
          />
        );
      case "inputInt":
      case "numericfield":
        return (
          <NodeTextField
            value={data[field.name]}
            placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
            onChange={(event) => {
              const value = event.target.value;
              const defaultValue =
                field.defaultValue != null ? +field.defaultValue : 0;
              let numericValue = isNaN(+value) ? defaultValue : +value;

              if (field.min != null && numericValue < +field.min) {
                numericValue = +field.min;
              }
              if (field.max != null && numericValue > +field.max) {
                numericValue = +field.max;
              }
              handleNodeDataChange(field.name, numericValue, event.target);
            }}
            error={isNaN(data[field.name])}
          />
        );
      case "textarea":
        return (
          <NodeTextarea
            key={`${id}-${field.name}`}
            textareaRef={textareaRef}
            field={field}
            data={data}
            isTouchDevice={isTouchDevice}
            onEventNodeDataChange={handleEventNodeDataChange}
            onNodeDataChange={handleNodeDataChange}
            id={id}
          />
        );
      case "select":
        return (
          <SelectAutocomplete
            key={`${id}-${field.name}`}
            onChange={(value) => handleNodeDataChange(field.name, value)}
            selectedValue={data[field.name] ?? ""}
            values={
              !!field.options
                ? field.options?.map((option) => {
                    return {
                      name: option.label,
                      value: option.value,
                    };
                  })
                : []
            }
          />
        );
      case "option":
        return (
          <div className="my-1 flex w-full items-center justify-center">
            <OptionSelector key={`${id}-${field.name}`}>
              {field.options?.map((option) => (
                <OptionButton
                  key={`${id}-${option.value}`}
                  selected={data[field.name] === option.value}
                  onClick={() => handleNodeDataChange(field.name, option.value)}
                  onTouchEnd={() =>
                    handleNodeDataChange(field.name, option.value)
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
              fieldToUpdate={field.associatedField}
              onNameClick={(value: string) => {
                if (!field.associatedField) return;
                const currentValue = data[field.associatedField] ?? "";
                handleNodeDataChange(
                  field.associatedField,
                  currentValue + value,
                );
              }}
              addNewInput={() => {
                const currentInputs = data.config.inputNames ?? [];
                const newInput = "input-" + (currentInputs.length + 1);
                const newInputs = [...currentInputs, newInput];
                const newConfig = {
                  ...data.config,
                  inputNames: newInputs,
                };
                handleNodeDataChange("config", newConfig);
              }}
              removeInput={() => {
                const currentInputs = data.config.inputNames ?? [];
                if (currentInputs.length <= 2) return;
                const newInputs = currentInputs.slice(0, -1);
                const newConfig = {
                  ...data.config,
                  inputNames: newInputs,
                };
                handleNodeDataChange("config", newConfig);
              }}
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
              className="nodrag track w-11/12"
              value={data[field.name]}
              onChange={(value) => handleNodeDataChange(field.name, value)}
              onChangeEnd={(value) => handleNodeDataChange(field.name, value)}
              styles={{
                track: {
                  backgroundColor: "rgba(54, 54, 54, 0.8)",
                  borderColor: "rgba(54, 54, 54, 0.8)",
                  height: "0.35em",
                },
                bar: {
                  backgroundColor: "rgba(29, 193, 226, 0.85)",
                },
                thumb: {
                  backgroundColor: "rgba(94, 209, 232, 1)",
                  borderColor: "rgba(94, 209, 232, 1)",
                },
              }}
              min={field.min}
              max={field.max}
              step={calculateStep(field.min, field.max)}
            />
          </div>
        );
      case "switch":
      case "boolean":
        return (
          <div className="flex w-full flex-row items-center">
            <Switch
              onChange={(e) =>
                handleNodeDataChange(field.name, e.currentTarget.checked)
              }
              checked={data[field.name]}
              className="nodrag"
              size="lg"
              color="rgba(29, 193, 226, 0.95)"
              onLabel="ON"
              offLabel="OFF"
            />
          </div>
        );

      case "list":
        const values = data[field.name] ?? [];
        return (
          <div className="w-full items-center">
            <PillsInput size="lg">
              <Pill.Group>
                {values.map((value: string, index: number) => (
                  <Pill
                    key={`${id}-${field.name}-${index}`}
                    withRemoveButton
                    onRemove={() => {
                      values.splice(index, 1);
                      handleNodeDataChange(field.name, values);
                    }}
                  >
                    {value}
                  </Pill>
                ))}
                <PillsInput.Field
                  placeholder={field.placeholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      values.push(e.currentTarget.value);
                      handleNodeDataChange(field.name, values);
                      e.currentTarget.value = "";
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) return;
                    values.push(e.currentTarget.value);
                    handleNodeDataChange(field.name, values);
                    e.currentTarget.value = "";
                  }}
                />
              </Pill.Group>
            </PillsInput>
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
      displayParams?.specificFields
        ? displayParams.specificFields.includes(field.name)
        : true,
    )
    .map((field: Field, index: number) => {
      if (displayParams?.showOnlyConnectedFields && !field.isLinked) {
        return null;
      }

      if (field.hidden) {
        return null;
      }

      return (
        <NodeField
          key={`${id}-${field.name}`}
          field={field}
          label={t(field.name) + `${field.required ? " *" : ""}`}
          renderField={renderField}
          handleId={generateIdForHandle(index)}
          displayParams={displayParams}
        />
      );
    });
}
