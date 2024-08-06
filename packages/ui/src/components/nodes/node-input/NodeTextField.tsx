import styled from "styled-components";
import { ChangeEvent } from "react";
import TextAreaPopupWrapper from "./TextAreaPopupWrapper";

interface NodeTextFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeValue?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  isTouchDevice?: boolean;
}

export default function NodeTextField({
  value,
  onChange,
  onChangeValue,
  placeholder,
  error,
  isTouchDevice,
}: NodeTextFieldProps) {
  function handleChangeValue(value: string) {
    if (onChangeValue) {
      onChangeValue(value);
    }
  }
  return (
    <TextAreaPopupWrapper onChange={handleChangeValue} initValue={value}>
      <NodeInput
        value={value}
        className={`nowheel ${!isTouchDevice ? "nodrag" : ""}`}
        onChange={(event) => onChange(event)}
        placeholder={placeholder}
      />
    </TextAreaPopupWrapper>
  );
}

const NodeInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 1.1em;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.nodeInputBg};
  padding: 12px 18px;
  border-radius: 8px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  transition: all ease-in-out;

  &:focus {
    border: solid;
    border-color: rgba(223, 223, 223, 0.175);
  }
`;
