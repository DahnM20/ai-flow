import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, Group, Button } from "@mantine/core";

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  messageVar: string;
  confirmButtonVar?: string;
  title?: string;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  onConfirm,
  onClose,
  messageVar,
  confirmButtonVar,
  title,
}) => {
  const { t } = useTranslation("flow");

  return (
    <Modal opened={isOpen} onClose={onClose} title={title} size="auto" centered>
      <Text>{messageVar} </Text>

      <Group mt="xl">
        <Button onClick={onConfirm}>{t(confirmButtonVar ?? "confirm")}</Button>
        <Button onClick={onClose}>{t("close")}</Button>
      </Group>
    </Modal>
  );
};
export default ConfirmPopup;
