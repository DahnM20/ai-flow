import { memo } from "react";

interface InputNameBarProps {
  inputNames: string[];
  textareaRef: any;
  fieldToUpdate?: string;
  onNameClick?: (value: string) => void;
}

function InputNameBar({
  inputNames,
  textareaRef,
  fieldToUpdate,
  onNameClick,
}: InputNameBarProps) {
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

  return (
    <div className="flex w-full flex-row items-center justify-center space-x-4 rounded-lg py-1 shadow">
      {inputNames.map((name) => {
        return (
          <div
            key={name}
            className="cursor-pointer rounded bg-slate-600/40 px-3 py-1 shadow-sm transition-colors duration-200 ease-in-out hover:bg-slate-400"
            onClick={() => handleNameClick(name)}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
}

export default memo(InputNameBar);
