import { Button, Textarea } from "@mantine/core";
import { ChangeEvent, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";

interface TextareaModalProps {
  initValue: string;
  onChange: (value: string) => void;
  onClose: () => void;
  fieldName?: string;
}
export function TextareaModal({
  initValue,
  fieldName,
  onChange,
  onClose,
}: TextareaModalProps) {
  const { t } = useTranslation("flow");
  const [value, setValue] = useState<string>(initValue);

  function handleChange(event: ChangeEvent<any>) {
    setValue(event.target.value);
  }

  function handleValidate() {
    onChange(value);
    onClose();
  }

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        style={{ zIndex: 9999 }}
        onClick={onClose}
        onTouchStart={onClose}
      >
        <div
          className="relative flex max-h-[80vh] w-3/4 flex-col overflow-y-auto rounded-lg bg-zinc-900 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 flex flex-col space-y-2">
            <div className="font-semibold">{t("EditTextContent")}</div>
            {fieldName && <p className="font-mono">{fieldName}</p>}
          </div>
          <Textarea
            defaultValue={value}
            onChange={handleChange}
            size="md"
            autosize
            minRows={20}
            maxRows={25}
          />
          <div className="flex justify-end pt-3">
            <Button color="teal" onClick={handleValidate}>
              {t("Validate")}
            </Button>
          </div>
          <button
            onClick={onClose}
            onTouchStart={onClose}
            className="absolute right-1 top-1 p-2 text-white"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
