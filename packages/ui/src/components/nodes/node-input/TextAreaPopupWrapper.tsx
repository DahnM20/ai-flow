import { Tooltip } from "@mantine/core";
import { FiExternalLink } from "react-icons/fi";
import { TextareaModal } from "../utils/TextareaModal";
import { useState } from "react";

interface TextAreaPopupWrapperProps {
  children: React.ReactNode;
  onChange: (value: string) => void;
  initValue: string;
}

function TextAreaPopupWrapper({
  children,
  onChange,
  initValue,
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
        <span className="absolute right-2 top-2">
          <Tooltip label={"Open in popup"}>
            <FiExternalLink onClick={openModal} />
          </Tooltip>
        </span>
        {children}
      </div>
      {modalOpen && (
        <TextareaModal
          initValue={initValue}
          onChange={onChange}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default TextAreaPopupWrapper;
