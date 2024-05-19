import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Modal } from "@mantine/core";

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("tips");

  const tips: string[] = t("tips", { returnObjects: true });

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Help"
      size="auto"
      centered
      styles={{
        title: {
          fontSize: "1.3rem",
          fontWeight: "bold",
          color: "white",
          paddingLeft: "0.5rem",
        },
        header: {
          backgroundColor: "#6b8177",
          fontSize: "1.5rem",
        },
        body: {
          backgroundColor: "rgb(24 24 27)",
        },
      }}
    >
      <PopupContent>
        <div className="flex flex-col items-center justify-center border-b-2 border-zinc-600/50 py-3 text-center text-xl font-bold">
          <p> {t("docAvailable")}</p>
          <a
            href="https://docs.ai-flow.net"
            className="text-[#8FB0A1] hover:text-slate-100 hover:underline"
            target="_blank"
          >
            {" "}
            docs.ai-flow.net{" "}
          </a>
        </div>

        <div className="flex justify-center py-2 text-xl font-bold">
          {t("tipsSection")}
        </div>

        <ul>
          {tips.map((tip, index) => (
            <li key={index} className="py-3">
              {tip}
            </li>
          ))}
        </ul>
      </PopupContent>
    </Modal>
  );
};

const PopupContent = styled.div.attrs({
  className:
    "text-slate-300 py-3 px-4 overflow-hidden hover:overflow-auto text-lg w-full rounded-lg",
})``;

export default HelpPopup;
