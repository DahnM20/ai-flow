import { memo } from "react";

interface InputNameBarProps {
    inputNames: string[];
    textareaRef: any;
}

function InputNameBar({ inputNames, textareaRef }: InputNameBarProps) {

    const insertAtCursor = (textarea: HTMLTextAreaElement | null, myValue: string) => {
        if (textarea) {
            if (textarea.selectionStart || textarea.selectionStart === 0) {
                let startPos = textarea.selectionStart;
                let endPos = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, startPos) + myValue + textarea.value.substring(endPos, textarea.value.length);
                textarea.selectionStart = startPos + myValue.length;
                textarea.selectionEnd = startPos + myValue.length;
            } else {
                textarea.value += myValue;
            }
        }
    }

    const handleNameClick = (name: string) => {
        insertAtCursor(textareaRef?.current, `\${${name}} `);
    }

    return (
        <div className="flex flex-row space-x-4 justify-center items-center py-1 rounded-lg shadow">
            {
                inputNames.map((name) => {
                    return (
                        <div
                            key={name}
                            className="cursor-pointer px-3 py-1 rounded bg-slate-600/40 hover:bg-slate-400 transition-colors duration-200 ease-in-out shadow-sm"
                            onClick={() => handleNameClick(name)}
                        >
                            {name}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default memo(InputNameBar);