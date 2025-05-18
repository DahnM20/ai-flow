import { InputHandle, NodeLabel } from "../Node.styles";
import { Position } from "reactflow";
import { Field } from "../../../nodes-configuration/types";
import { DisplayParams } from "../../../hooks/useFormFields";
import { FiFile, FiInfo, FiPlus, FiTrash } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mantine/core";

interface NodeFieldProps<T> {
  field: T;
  renderField: (field: T, isLoopField?: boolean) => JSX.Element;
  label: string;
  handleId?: string;
  displayParams?: DisplayParams;
  handlePosition?: Position;
  onAddNewField?: () => void;
  onDeleteField?: () => void;
}

function NodeField<
  T extends Pick<
    Field,
    | "required"
    | "label"
    | "hasHandle"
    | "isLinked"
    | "description"
    | "hidden"
    | "type"
  >,
>({
  field,
  displayParams,
  renderField,
  label,
  handlePosition = Position.Left,
  handleId,
  onAddNewField,
  onDeleteField,
}: NodeFieldProps<T>) {
  const { t } = useTranslation("flow");
  return (
    <>
      {field.label && displayParams?.showLabels && (
        <div className="flex flex-row items-center justify-between ">
          <div className="flex flex-row items-center space-x-5">
            {field.hasHandle && displayParams?.showHandles && (
              <InputHandle
                className="handle custom-handle"
                required={field.required}
                type="target"
                position={handlePosition}
                id={handleId}
              />
            )}
            <div className="flex flex-row items-center justify-center space-x-1">
              <NodeLabel
                className={`font-mono text-lg
                        ${field.isLinked ? "linkedToNode text-sky-400" : ""}  
                        ${field.required ? "font-bold" : ""}`}
              >
                {label}
              </NodeLabel>

              {field.type === "fileUpload" && <FiFile />}
              {field.required ? <span className="text-lg">*</span> : null}
            </div>
          </div>
          {!!field.description && (
            <Tooltip
              label={t(field.description)}
              openDelay={300}
              position="top-start"
              color="dark"
              transitionProps={{ transition: "slide-up", duration: 300 }}
              multiline
            >
              <span>
                <FiInfo className="cursor-pointer text-xl hover:text-teal-300" />
              </span>
            </Tooltip>
          )}
        </div>
      )}
      {!field.isLinked && (
        <div className="flex h-full pb-3">{renderField(field)}</div>
      )}

      {onAddNewField && (
        <div className="mt-3 flex w-full justify-end space-x-3">
          <button
            className="flex items-center justify-center rounded-md bg-sky-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
            onClick={onAddNewField}
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add {field.label} field
          </button>
          {onDeleteField && (
            <button
              className="flex items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400/50"
              onClick={onDeleteField}
            >
              <FiTrash className="mr-2 h-4 w-4" />
              Remove {field.label} field
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default NodeField;
