import { useTranslation } from "react-i18next";
import { OptionSelector, OptionButton } from "../components/nodes/Node.styles";
import InputNameBar from "../components/nodes/node-button/InputNameBar";
import { Field } from "../nodes-configuration/types";
import React, { useCallback, useEffect, useRef } from "react";
import { generateIdForHandle } from "../utils/flowUtils";
import { Autocomplete, Pill, PillsInput, Select, Slider } from "@mantine/core";
import { Switch } from "@mantine/core";
import NodeField from "../components/nodes/node-input/NodeField";
import SelectAutocomplete from "../components/selectors/SelectAutocomplete";
import NodeTextField from "../components/nodes/node-input/NodeTextField";
import useIsTouchDevice from "./useIsTouchDevice";
import _ from "lodash";
import NodeTextarea from "../components/nodes/node-input/NodeTextarea";
import { KeyValueInputList } from "../components/nodes/node-input/KeyValueInputList";
import ImageMaskCreatorFieldFlowAware from "../components/nodes/node-input/ImageMaskCreatorFieldFlowAware";
import { evaluateCondition } from "../utils/evaluateConditions";
import FileUploadField from "../components/nodes/node-input/FileUploadField";
export interface DisplayParams {
  showHandles?: boolean;
  showLabels?: boolean;
  showOnlyConnectedFields?: boolean;
  specificFields?: string[];
}

export function useFormFields(
  data: any,
  id: string,
  handleNodeFieldChange: (fieldName: string, value: any, target?: any) => void,
  setDefaultOptions?: Function,
  hasParent?: Function,
  displayParams?: DisplayParams,
  handleNodeDataChange?: (data: any) => void,
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
    handleNodeFieldChange(event.target.name, event.target.value, event.target);
  };

  function calculateStep(min?: number, max?: number, allowDecimal?: boolean) {
    if (min == null || max == null) return 1;

    const range = max - min;
    let step;

    if (range <= 1 && allowDecimal) {
      step = 0.01;
    } else if (range <= 10 && allowDecimal) {
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

  function renderList(data: any, field: Field) {
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
                  handleNodeFieldChange(field.name, values);
                }}
              >
                {value}
              </Pill>
            ))}
            <PillsInput.Field
              placeholder={
                t(field.placeholder ?? "") ?? t("DefaultListPlaceholder") ?? ""
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  values.push(e.currentTarget.value);
                  handleNodeFieldChange(field.name, values);
                  e.currentTarget.value = "";
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.value) return;
                values.push(e.currentTarget.value);
                handleNodeFieldChange(field.name, values);
                e.currentTarget.value = "";
              }}
            />
          </Pill.Group>
        </PillsInput>
      </div>
    );
  }

  const renderField = (field: Field, isLoopField?: boolean) => {
    if (isLoopField) {
      return renderList(data, field);
    }
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
              handleNodeFieldChange(
                field.name,
                event.target.value,
                event.target,
              );
            }}
            onChangeValue={(value) => {
              handleNodeFieldChange(field.name, value);
            }}
            fieldName={field?.name}
            withEditPopup={field?.withModalEdit ?? true}
          />
        );
      case "inputInt":
      case "numericfield":
        return (
          <NodeTextField
            value={data[field.name]}
            placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
            isTouchDevice={isTouchDevice}
            onChange={(event) => {
              const value = event.target.value;

              if (value === "") {
                handleNodeFieldChange(field.name, undefined);
                return;
              }

              const defaultValue =
                field.defaultValue != null ? +field.defaultValue : 0;

              let numericValue = isNaN(+value) ? defaultValue : +value;

              if (field.min != null && numericValue < +field.min) {
                numericValue = +field.min;
              }
              if (field.max != null && numericValue > +field.max) {
                numericValue = +field.max;
              }
              handleNodeFieldChange(field.name, numericValue);
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
            withMinHeight
            isTouchDevice={isTouchDevice}
            onEventNodeDataChange={handleEventNodeDataChange}
            onNodeDataChange={handleNodeFieldChange}
            id={id}
          />
        );
      case "select":
        return (
          <SelectAutocomplete
            key={`${id}-${field.name}`}
            onChange={(value) => handleNodeFieldChange(field.name, value)}
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
                  onClick={() =>
                    handleNodeFieldChange(field.name, option.value)
                  }
                  onTouchEnd={() =>
                    handleNodeFieldChange(field.name, option.value)
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
                handleNodeFieldChange(
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
                handleNodeFieldChange("config", newConfig);
              }}
              removeInput={() => {
                const currentInputs = data.config.inputNames ?? [];
                if (currentInputs.length <= 2) return;
                const newInputs = currentInputs.slice(0, -1);
                const newConfig = {
                  ...data.config,
                  inputNames: newInputs,
                };
                handleNodeFieldChange("config", newConfig);
              }}
            />
          )
        );
      case "slider":
        return (
          <div className="flex w-full flex-row items-center justify-center">
            <p className="w-1/12 text-left text-sm text-blue-700 dark:text-blue-200">
              {data[field.name]}
            </p>
            <Slider
              className="nodrag track w-11/12"
              value={data[field.name]}
              onChange={(value) => handleNodeFieldChange(field.name, value)}
              onChangeEnd={(value) => handleNodeFieldChange(field.name, value)}
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
              step={
                !!field.step
                  ? field.step
                  : calculateStep(
                      field.min,
                      field.max,
                      field.allowDecimal ?? true,
                    )
              }
            />
          </div>
        );
      case "switch":
      case "boolean":
        return (
          <div className="flex w-full flex-row items-center">
            <Switch
              onChange={(e) =>
                handleNodeFieldChange(field.name, e.currentTarget.checked)
              }
              checked={data[field.name]}
              className={`nowheel ${!isTouchDevice ? "nodrag" : ""}`}
              size="lg"
              color="rgba(29, 193, 226, 0.95)"
              onLabel="ON"
              offLabel="OFF"
            />
          </div>
        );

      case "list":
        return renderList(data, field);

      case "dictionnary":
        return (
          <KeyValueInputList
            pairs={data[field.name] ?? []}
            onChange={(pairs: any) => handleNodeFieldChange(field.name, pairs)}
          />
        );

      case "imageMaskCreator":
        return (
          <ImageMaskCreatorFieldFlowAware
            key={`${id}-${field.name}`}
            onChange={(value) => handleNodeFieldChange(field.name, value)}
          />
        );

      case "fileUpload":
        return (
          <div className="text-md w-full">
            <FileUploadField
              value={data[field.name]}
              onFileUpload={(info) => {
                handleNodeFieldChange(field.name, info.url);
              }}
              onUrlSubmit={(url) => {
                handleNodeFieldChange(field.name, url);
              }}
              isRenderForNode
            />
          </div>
        );

      default:
        return (
          <p>
            {t("FieldNotSupportedInCurrentVersion")} {field.type}
          </p>
        );
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
    .filter((field: Field) => {
      if (!field.condition) return true;

      return evaluateCondition(field.condition, data);
    })
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
          label={t(field.name)}
          renderField={renderField}
          handleId={generateIdForHandle(index)}
          displayParams={displayParams}
          onAddNewField={
            field.canAddChildrenFields
              ? () => {
                  // Get the current input names list (or empty if not set)
                  const currentInputs = data.config.inputNames ?? [];
                  // Find the index of the current field in the list
                  const currentIndex = currentInputs.findIndex(
                    (name: string) => name === field.name,
                  );
                  // Generate new field name: if parent's name is "file_url", new name becomes "file_url_2"
                  let newFieldName;
                  const match = field.name.match(/^(.*?)(?:_(\d+))?$/);
                  if (match) {
                    const baseName = match[1];
                    const suffix = match[2] ? parseInt(match[2], 10) : 1;
                    newFieldName = `${baseName}_${suffix + 1}`;
                  } else {
                    newFieldName = field.name + "_2";
                  }
                  // Insert the new field name right after the current field
                  const newInputs = [
                    ...currentInputs.slice(0, currentIndex + 1),
                    newFieldName,
                    ...currentInputs.slice(currentIndex + 1),
                  ];

                  // Update fields: disable the parent's add button and add the new child field
                  let updatedFields = [...data.config.fields];
                  const parentFieldIndex = updatedFields.findIndex(
                    (f) => f.name === field.name,
                  );
                  if (parentFieldIndex !== -1) {
                    // Disable parent's add button
                    updatedFields[parentFieldIndex] = {
                      ...updatedFields[parentFieldIndex],
                      canAddChildrenFields: false,
                    };
                  }
                  // Create new child field with its add button enabled
                  const newChildField: Field = {
                    ...field,
                    name: newFieldName,
                    isChild: true,
                    isLinked: false,
                    required: false,
                    canAddChildrenFields: true,
                  };
                  // Insert new child field right after the parent
                  updatedFields.splice(parentFieldIndex + 1, 0, newChildField);

                  // Update config with the new input names and fields order
                  const newConfig = {
                    ...data.config,
                    inputNames: newInputs,
                    fields: updatedFields,
                  };

                  const newNodeData = {
                    ...data,
                    config: newConfig,
                  };

                  if (!!handleNodeDataChange) {
                    handleNodeDataChange(newNodeData);
                  }
                }
              : undefined
          }
          onDeleteField={
            field.isChild && field.canAddChildrenFields
              ? () => {
                  // 1. Remove the deleted child's name from the inputNames list.
                  const currentInputs = data.config.inputNames ?? [];
                  const removeIndex = currentInputs.findIndex(
                    (name: string) => name === field.name,
                  );
                  if (removeIndex === -1) return;

                  let newInputs = [
                    ...currentInputs.slice(0, removeIndex),
                    ...currentInputs.slice(removeIndex + 1),
                  ];

                  // 2. Remove the corresponding field from the fields array.
                  let updatedFields = [...data.config.fields];
                  const fieldIndex = updatedFields.findIndex(
                    (f) => f.name === field.name,
                  );
                  if (fieldIndex !== -1) {
                    updatedFields.splice(fieldIndex, 1);
                  }

                  // 3. Determine the base name (e.g. "file_url") from the deleted field.
                  const match = field.name.match(/^(.*?)(?:_(\d+))?$/);
                  if (!match) return;
                  const baseName = match[1];

                  // 4. Identify the contiguous group in newInputs that belongs to this base name.
                  // The parent's field should be the first one (with name exactly equal to baseName).
                  const parentIndex = newInputs.findIndex(
                    (name) => name === baseName,
                  );
                  if (parentIndex === -1) return; // nothing to do if parent is missing

                  // Collect indices for fields in the group (parent and its children)
                  let groupIndices: number[] = [];
                  for (let i = parentIndex; i < newInputs.length; i++) {
                    const regex = new RegExp(`^${baseName}(?:_\\d+)?$`);
                    if (regex.test(newInputs[i])) {
                      groupIndices.push(i);
                    } else {
                      break;
                    }
                  }

                  // 5. Reassign new names sequentially in the group:
                  // Parent remains as baseName; children become baseName_2, baseName_3, etc.
                  newInputs = newInputs.map((name, idx) => {
                    if (groupIndices.includes(idx)) {
                      const pos = groupIndices.indexOf(idx);
                      return pos === 0 ? baseName : `${baseName}_${pos + 1}`;
                    }
                    return name;
                  });

                  // 6. Update names in the fields array for those belonging to the group.
                  let groupCounter = 1;
                  updatedFields = updatedFields.map((f) => {
                    const regexField = new RegExp(`^${baseName}(?:_\\d+)?$`);
                    if (regexField.test(f.name)) {
                      const newName =
                        groupCounter === 1
                          ? baseName
                          : `${baseName}_${groupCounter}`;
                      groupCounter++;
                      return {
                        ...f,
                        name: newName,
                      };
                    }
                    return f;
                  });

                  // 7. Update add button state: disable all in the group then enable it only on the last one.
                  updatedFields = updatedFields.map((f) => {
                    const regexField = new RegExp(`^${baseName}(?:_\\d+)?$`);
                    if (regexField.test(f.name)) {
                      return { ...f, canAddChildrenFields: false };
                    }
                    return f;
                  });
                  for (let i = updatedFields.length - 1; i >= 0; i--) {
                    const regexField = new RegExp(`^${baseName}(?:_\\d+)?$`);
                    if (regexField.test(updatedFields[i].name)) {
                      updatedFields[i] = {
                        ...updatedFields[i],
                        canAddChildrenFields: true,
                      };
                      break;
                    }
                  }

                  // 8. Update the config with the new inputNames and fields order.
                  const newConfig = {
                    ...data.config,
                    inputNames: newInputs,
                    fields: updatedFields,
                  };

                  const newNodeData = {
                    ...data,
                    config: newConfig,
                  };

                  if (!!handleNodeDataChange) {
                    handleNodeDataChange(newNodeData);
                  }
                }
              : undefined
          }
        />
      );
    });
}
