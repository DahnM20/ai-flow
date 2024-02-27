import { InputHandle, NodeLabel } from "../Node.styles";
import { Position } from "reactflow";
import { Field } from "../../../nodes-configuration/nodeConfig";

interface NodeFieldProps<T> {
  field: T;
  renderField: (field: T) => JSX.Element;
  label: string;
  handleId?: string;
  showHandles?: boolean;
  handlePosition?: Position;
}

export default function NodeField<
  T extends Pick<Field, "required" | "label" | "hasHandle" | "isLinked">,
>({
  field,
  showHandles,
  renderField,
  label,
  handlePosition = Position.Left,
  handleId,
}: NodeFieldProps<T>) {
  return (
    <>
      {field.label && showHandles && (
        <div className="flex flex-row items-center space-x-5">
          {field.hasHandle && (
            <InputHandle
              className="handle custom-handle"
              required={field.required}
              type="target"
              position={handlePosition}
              id={handleId}
            />
          )}
          <NodeLabel
            className={`font-md
                        ${field.isLinked ? "text-sky-400" : ""}  
                        ${field.required ? "font-bold" : ""}`}
          >
            {label}
          </NodeLabel>
        </div>
      )}
      {!field.isLinked && renderField(field)}
    </>
  );
}
