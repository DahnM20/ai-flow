import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { useContext, useState } from "react";
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
import { FiMail } from "react-icons/fi";
import { Modal } from "@mantine/core";

interface ConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate?: () => void;
}

const ConfigPopup = ({ isOpen, onClose, onValidate }: ConfigPopupProps) => {
  const { t } = useTranslation("config");
  const { updateSocket } = useContext(SocketContext);

  const [parameters, setParameters] = useState<Parameters>(
    getConfigParameters(),
  );

  const onParameterChange = (section: string, name: string, value: any) => {
    setParameters((prevParameters) => ({
      ...prevParameters,
      [section]: {
        ...prevParameters[section],
        [name]: {
          ...prevParameters[section][name],
          value,
        },
      },
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

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      withCloseButton={false}
      size="auto"
      centered
      styles={{
        content: {
          borderRadius: "0.75em",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(135deg, #101113, #1a1b1e)",
          padding: "2em",
          color: "#d8dee9",
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
      <Content>
        <h2 className="mb-5 text-center text-2xl font-bold">
          {t("configurationTitle")}
        </h2>
        <Disclaimer>
          <p>{t("openSourceDisclaimer")}</p>
          <p>{t("apiKeyDisclaimer")}</p>
        </Disclaimer>
        <ParametersContainer>
          <ParameterFields
            parameters={parameters}
            onParameterChange={onParameterChange}
          />
        </ParametersContainer>
        <Actions>
          <ActionButton
            onClick={handleClose}
            className="bg-slate-800 hover:bg-slate-700"
          >
            {t("closeButtonLabel")}
          </ActionButton>
          <ActionButton
            onClick={handleValidate}
            className="bg-teal-500 hover:bg-teal-400"
          >
            {t("validateButtonLabel")}
          </ActionButton>
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
    </Modal>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
`;

const Disclaimer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1em;
  color: #6b7280;
`;

const ParametersContainer = styled.div`
  display: flex;
  justify-content: center;
  overflow: auto;
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1em;
`;

const ActionButton = styled.button`
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
  transition: background-color 0.3s ease-in-out;
`;

const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
`;

const Message = styled.p`
  margin-bottom: 10px;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;
`;

const Icon = styled.a`
  font-size: 1.75em;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #b3edff;
  }
`;

export default ConfigPopup;
