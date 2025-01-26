import { memo } from "react";
import { Tooltip, ActionIcon } from "@mantine/core";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface InputNameBarProps {
  inputNames: string[];
  textareaRef: any;
  fieldToUpdate?: string;
  onNameClick?: (value: string) => void;
  addNewInput?: () => void;
  removeInput?: () => void;
}

function InputNameBar({
  inputNames,
  textareaRef,
  fieldToUpdate,
  onNameClick,
  addNewInput,
  removeInput,
}: InputNameBarProps) {
  const { t } = useTranslation("flow");

  const insertAtCursor = (
    textarea: HTMLTextAreaElement | null,
    myValue: string,
  ) => {
    if (textarea) {
      if (textarea.selectionStart || textarea.selectionStart === 0) {
        let startPos = textarea.selectionStart;
        let endPos = textarea.selectionEnd;
        textarea.value =
          textarea.value.substring(0, startPos) +
          myValue +
          textarea.value.substring(endPos, textarea.value.length);
        textarea.selectionStart = startPos + myValue.length;
        textarea.selectionEnd = startPos + myValue.length;
      } else {
        textarea.value += myValue;
      }
    }
  };

  const handleNameClick = (name: string) => {
    if (!fieldToUpdate) {
      insertAtCursor(textareaRef?.current, `\${${name}} `);
    }
    onNameClick?.(`\${${name}} `);
  };

  const handleAddInput = () => {
    if (addNewInput) addNewInput();
  };

  return (
    <div className="flex w-full flex-row items-center justify-center space-x-2 rounded-lg py-1 shadow">
      {inputNames.map((name) => (
        <div
          key={name}
          className="flex cursor-pointer items-center space-x-1 rounded bg-slate-600/40 px-3 py-1 shadow-sm transition-colors duration-200 ease-in-out hover:bg-slate-400"
          onClick={() => handleNameClick(name)}
        >
          <span>{name}</span>
        </div>
      ))}
      {!!handleAddInput && !!removeInput && (
        <>
          <Tooltip label={t("AddInput")} position="top" withArrow>
            <ActionIcon color="gray" variant="filled" onClick={handleAddInput}>
              <FaPlus size={16} />
            </ActionIcon>
          </Tooltip>
          {inputNames.length > 2 && (
            <Tooltip label={t("RemoveInput")} position="top" withArrow>
              <ActionIcon color="gray" variant="filled" onClick={removeInput}>
                <FaMinus size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
}

export default memo(InputNameBar);
