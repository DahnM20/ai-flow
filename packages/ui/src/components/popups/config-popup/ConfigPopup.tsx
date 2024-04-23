import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  SocketContext,
  WSConfiguration,
} from "../../../providers/SocketProvider";
import { useTranslation } from "react-i18next";
import ParameterFields from "./ParametersFields";
import {
  Parameters,
  getConfigParameters,
  updateParameters,
} from "./parameters";
import DefaultPopupWrapper from "../DefaultPopup";
import { FiMail } from "react-icons/fi";

interface ConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate?: () => void;
}

function ConfigPopup({ isOpen, onClose, onValidate }: ConfigPopupProps) {
  const { t } = useTranslation("config");

  const { updateSocket } = useContext(SocketContext);

  const [parameters, setParameters] = useState<Parameters>(
    getConfigParameters(),
  );

  const onParameterChange = (section: string, name: string, value: any) => {
    const sectionParameters = parameters[section];
    if (!sectionParameters) {
      return;
    }
    const parameter = sectionParameters[name];
    if (!parameter) {
      return;
    }
    parameter.value = value;
    setParameters((prevParameters) => ({
      ...prevParameters,
      [section]: sectionParameters,
    }));
  };

  const handleValidate = () => {
    updateParameters(parameters);

    const config: WSConfiguration = {};

    updateSocket(config);
    onClose();
  };

  const handleClose = () => {
    setParameters(getConfigParameters());
    onClose();
  };

  return isOpen ? (
    <DefaultPopupWrapper show={isOpen} onClose={handleClose} centered>
      <Content
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="my-2 flex flex-col justify-between overflow-auto rounded-2xl bg-slate-100 p-5 md:h-fit"
      >
        <Header>
          <Title className="text-zinc-900">{t("configurationTitle")}</Title>
        </Header>
        <>
          <SoftMessage>{t("openSourceDisclaimer")}</SoftMessage>
          <SoftMessage>{t("apiKeyDisclaimer")}</SoftMessage>
          <SoftMessage>{t("apiKeyRevokeReminder")}</SoftMessage>
        </>

        <div className="w-full overflow-auto">
          <ParameterFields
            parameters={parameters}
            onParameterChange={onParameterChange}
          />
        </div>
        <Actions>
          <Button onClick={onClose} className="bg-[#9B8D8A]">
            {t("closeButtonLabel")}
          </Button>
          <Button onClick={handleValidate} className="bg-[#72CCA5]">
            {t("validateButtonLabel")}
          </Button>
        </Actions>
        <Footer>
          <Message>{t("supportProjectPrompt")}</Message>
          <Icons>
            <Icon
              href="https://github.com/DahnM20/ai-flow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </Icon>
            <Icon
              href="https://twitter.com/DahnM20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter />
            </Icon>
            <Icon href="mailto:support@ai-flow.net">
              <FiMail />
            </Icon>
          </Icons>
        </Footer>
      </Content>
    </DefaultPopupWrapper>
  ) : (
    <></>
  );
}

export const Popup = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpen ? "all" : "none")};
`;

const Content = styled.div`
  position: relative;
  width: 500px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #555;
  }
`;

const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #777;
`;

const Message = styled.p`
  margin-bottom: 10px;
`;

const SoftMessage = styled.p`
  text-align: center;
  color: #888;
  margin-bottom: 20px;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;
`;

const Icon = styled.a`
  font-size: 24px;
  color: #555;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

export default ConfigPopup;
