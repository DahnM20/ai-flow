import React from "react";
import { Modal, Text, Button } from "@mantine/core";

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmButtonLabel?: string;
  title?: string;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  onConfirm,
  onClose,
  message,
  confirmButtonLabel,
  title,
}) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={title}
      withCloseButton={false}
      size="md"
      centered
      styles={{
        content: {
          borderRadius: "0.75em",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(135deg, #101113, #1a1b1e)",
          padding: "2em",
        },
        title: {
          fontSize: "1.25rem",
          color: "#d8dee9",
          fontWeight: "bold",
          marginBottom: "0.5em",
        },
        header: {
          background: "transparent",
        },
      }}
    >
      <Text mt="md" color="#d8dee9">
        {message}
      </Text>

      <div className="mt-5 flex justify-center space-x-3">
        <Button
          onClick={onConfirm}
          color="#4cb897"
          styles={{
            root: {
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "0.5em",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
            label: {
              padding: "0.75em 1em",
            },
          }}
        >
          {confirmButtonLabel ?? "Confirm"}
        </Button>
        <Button
          onClick={onClose}
          color="#8d8d8d"
          styles={{
            root: {
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "0.5em",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
            label: {
              padding: "0.75em 1em",
            },
          }}
        >
          {"Ignore"}
        </Button>
      </div>
    </Modal>
  );
};
export default ConfirmPopup;
