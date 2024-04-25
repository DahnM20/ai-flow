import { TextInput } from "@mantine/core";
import styled from "styled-components";
import { theme } from "../../shared/theme";
import { ChangeEvent } from "react";

interface NodeTextFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
}

export default function NodeTextField({
  value,
  onChange,
  placeholder,
  error,
}: NodeTextFieldProps) {
  return (
    <NodeInput
      value={value}
      className="nodrag"
      onChange={(event) => onChange(event)}
      placeholder={placeholder}
    />
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
