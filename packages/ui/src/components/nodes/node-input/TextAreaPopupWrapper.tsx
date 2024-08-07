import { Tooltip } from "@mantine/core";
import { FiExternalLink } from "react-icons/fi";
import { TextareaModal } from "../utils/TextareaModal";
import { useState } from "react";

interface TextAreaPopupWrapperProps {
  children: React.ReactNode;
  onChange: (value: string) => void;
  initValue: string;
  fieldName?: string;
}

function TextAreaPopupWrapper({
  children,
  onChange,
  initValue,
  fieldName,
}: TextAreaPopupWrapperProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <>
      <div className="relative w-full">
        <span className="absolute right-2 top-2 cursor-pointer text-slate-400 transition-colors duration-100 ease-in-out hover:text-stone-100">
          <Tooltip label={"Open in popup"}>
            <FiExternalLink onClick={openModal} />
          </Tooltip>
        </span>
        {children}
      </div>
      {modalOpen && (
        <TextareaModal
          initValue={initValue}
          fieldName={fieldName}
          onChange={onChange}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default TextAreaPopupWrapper;
