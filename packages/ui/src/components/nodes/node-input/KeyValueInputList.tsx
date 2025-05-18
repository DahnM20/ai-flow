// KeyValueInputList.tsx
import React from "react";
import { Button, Group, TextInput } from "@mantine/core";
import { MdClear } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueInputListProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
}

export const KeyValueInputList: React.FC<KeyValueInputListProps> = ({
  pairs,
  onChange,
}) => {
  const handleKeyChange = (index: number, newKey: string) => {
    const newPairs = [...pairs];
    newPairs[index].key = newKey;
    onChange(newPairs);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const newPairs = [...pairs];
    newPairs[index].value = newValue;
    onChange(newPairs);
  };

  const handleAddPair = () => {
    onChange([...pairs, { key: "", value: "" }]);
  };

  const handleRemovePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    onChange(newPairs);
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      {!!pairs &&
        pairs.map((pair, index) => (
          <Group key={index} align="center">
            <TextInput
              placeholder="Key"
              value={pair.key}
              onChange={(event) =>
                handleKeyChange(index, event.currentTarget.value)
              }
              style={{ flex: 1 }}
            />
            <TextInput
              placeholder="Value"
              value={pair.value}
              onChange={(event) =>
                handleValueChange(index, event.currentTarget.value)
              }
              style={{ flex: 1 }}
            />
            <MdClear
              className="text-af-text-element-2 h-full w-5 cursor-pointer transition-colors duration-150 ease-in-out hover:text-red-500"
              onClick={() => handleRemovePair(index)}
            />
          </Group>
        ))}
      <div>
        <Button onClick={handleAddPair} color="gray">
          <span className="flex flex-row space-x-2">
            <FaPlus /> <p> Add </p>
          </span>
        </Button>
      </div>
    </div>
  );
};
