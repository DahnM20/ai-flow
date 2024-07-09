import { InputHandle, NodeLabel } from "../Node.styles";
import { Position } from "reactflow";
import { Field } from "../../../nodes-configuration/types";
import { DisplayParams } from "../../../hooks/useFormFields";
import { FiInfo } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mantine/core";

interface NodeFieldProps<T> {
  field: T;
  renderField: (field: T) => JSX.Element;
  label: string;
  handleId?: string;
  displayParams?: DisplayParams;
  handlePosition?: Position;
}

export default function NodeField<
  T extends Pick<
    Field,
    "required" | "label" | "hasHandle" | "isLinked" | "description"
  >,
>({
  field,
  displayParams,
  renderField,
  label,
  handlePosition = Position.Left,
  handleId,
}: NodeFieldProps<T>) {
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
            <NodeLabel
              className={`font-mono text-lg
                        ${field.isLinked ? "text-sky-400" : ""}  
                        ${field.required ? "font-bold" : ""}`}
            >
              {label}
            </NodeLabel>
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
    </>
  );
}
