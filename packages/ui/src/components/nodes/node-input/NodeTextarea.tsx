import { useTranslation } from "react-i18next";
import { DisplayParams } from "../../../hooks/useFormFields";
import { Field } from "../../../nodes-configuration/types";
import { StyledNodeTextarea } from "../Node.styles";
import { GenericNodeData } from "../types/node";
import { useEffect, useState } from "react";
import TextAreaPopupWrapper from "./TextAreaPopupWrapper";
import { useReactFlow } from "reactflow";

interface NodeTextareaProps {
  data: GenericNodeData;
  field: Field;
  displayParams?: DisplayParams;
  id: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isTouchDevice: boolean;
  withMinHeight: boolean;
  onEventNodeDataChange: (event: any) => void;
  onNodeDataChange: (fieldName: string, value: any, target?: any) => void;
}
export default function NodeTextarea({
  data,
  field,
  id,
  textareaRef,
  isTouchDevice,
  withMinHeight,
  onEventNodeDataChange,
  onNodeDataChange,
}: NodeTextareaProps) {
  const { t } = useTranslation("flow");
  let reactFlowInstance: any;
  try {
    reactFlowInstance = useReactFlow(); //TMP
  } catch (error) {
    //Do nothing
  }

  const [isTextareaSelected, setIsTextareaSelected] = useState(false);

  useEffect(() => {
    const maxHeight = 1000;
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";

      const rect = textarea.getBoundingClientRect();
      const currentZoom = !!reactFlowInstance ? reactFlowInstance.getZoom() : 1;
      const adjustedTop = rect.top / currentZoom;
      const availableSpaceBelow =
        window.innerHeight / currentZoom - adjustedTop;

      const allowedHeight = Math.min(
        textarea.scrollHeight,
        maxHeight,
        availableSpaceBelow,
      );

      textarea.style.height = `${allowedHeight}px`;
    }
  }, [data[field.name]]);

  const handleFocus = () => {
    setIsTextareaSelected(true);
  };

  const handleBlur = () => {
    setIsTextareaSelected(false);
  };

  const isControlled = !isTextareaSelected;

  return (
    <TextAreaPopupWrapper
      onChange={(value) => onNodeDataChange(field.name, value)}
      initValue={data[field.name]}
      fieldName={field.name}
    >
      <StyledNodeTextarea
        ref={textareaRef}
        name={field.name}
        className={`nowheel ${!isTouchDevice ? "nodrag" : ""}`}
        value={isControlled ? data[field.name] : undefined}
        defaultValue={!isControlled ? data[field.name] : undefined}
        placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
        withMinHeight={withMinHeight}
        onChange={onEventNodeDataChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </TextAreaPopupWrapper>
  );
}
