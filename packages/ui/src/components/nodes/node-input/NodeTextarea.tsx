import { useTranslation } from "react-i18next";
import { DisplayParams } from "../../../hooks/useFormFields";
import { Field } from "../../../nodes-configuration/types";
import { StyledNodeTextarea } from "../Node.styles";
import { GenericNodeData } from "../types/node";
import { useState } from "react";
import TextAreaPopupWrapper from "./TextAreaPopupWrapper";

interface NodeTextareaProps {
  data: GenericNodeData;
  field: Field;
  displayParams?: DisplayParams;
  id: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isTouchDevice: boolean;
  onEventNodeDataChange: (event: any) => void;
  onNodeDataChange: (fieldName: string, value: any, target?: any) => void;
}
export default function NodeTextarea({
  data,
  field,
  textareaRef,
  isTouchDevice,
  onEventNodeDataChange,
  onNodeDataChange,
}: NodeTextareaProps) {
  const { t } = useTranslation("flow");

  const [isTextareaSelected, setIsTextareaSelected] = useState(false);

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
    >
      <StyledNodeTextarea
        ref={textareaRef}
        name={field.name}
        className={`nowheel ${!isTouchDevice ? "nodrag" : ""}`}
        value={isControlled ? data[field.name] : undefined}
        defaultValue={!isControlled ? data[field.name] : undefined}
        placeholder={field.placeholder ? String(t(field.placeholder)) : ""}
        onChange={onEventNodeDataChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </TextAreaPopupWrapper>
  );
}
