import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";
import DefaultPopupWrapper from "./DefaultPopup";

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("tips");

  const tips: string[] = t("tips", { returnObjects: true });

  return (
    <DefaultPopupWrapper onClose={onClose} show={isOpen} centered>
      <PopupHeader>
        <div>Help</div>
        <div onClick={onClose} className="text-slate-300 hover:text-slate-50">
          <MdClose />
        </div>
      </PopupHeader>
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
    </DefaultPopupWrapper>
  );
};

const PopupHeader = styled.div.attrs({
  className:
    "flex flex-row h-10 w-full items-center justify-between py-2 px-4 text-xl text-slate-100 bg-[#8FB0A1]/70 rounded-t-md",
})``;
const PopupContent = styled.div.attrs({
  className:
    "bg-zinc-900 text-slate-300 py-3 px-4 overflow-hidden hover:overflow-auto text-lg h-3/4 w-full rounded-lg",
})``;

export default HelpPopup;
