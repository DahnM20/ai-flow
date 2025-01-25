import { FaGithub, FaXTwitter } from "react-icons/fa6";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Modal } from "@mantine/core";
import { UserParameters } from "./UserParameters";
import DisplayParameters from "./DisplayParameters";
import { useVisibility } from "../../../providers/VisibilityProvider";

interface ConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate?: () => void;
}

const ConfigPopup = ({ isOpen }: ConfigPopupProps) => {
  const { t } = useTranslation("config");

  const { getElement, configActiveTab, setConfigActiveTab } = useVisibility();
  const configPopup = getElement("configPopup");

  const handleClose = () => {
    configPopup.hide();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      withCloseButton={false}
      size="50%"
      centered
      styles={{
        content: {
          borderRadius: "0.75em",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background:
            "linear-gradient(135deg, #101113, #1a1b1e), url('/backgrounds/g-simple.png')",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
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
        <Tabs className="sm:text-md text-base">
          <Tab
            isActive={configActiveTab === "user"}
            onClick={() => setConfigActiveTab("user")}
          >
            {t("userTabLabel")}
          </Tab>
          <Tab
            isActive={configActiveTab === "display"}
            onClick={() => setConfigActiveTab("display")}
          >
            {t("displayTabLabel")}
          </Tab>
        </Tabs>
        {configActiveTab === "user" && <UserParameters />}
        {configActiveTab === "display" && <DisplayParameters />}
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

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 10px 20px;
  font-weight: bold;
  color: ${(props) => (props.isActive ? "#fff" : "#b4b4b4")};
  background-color: ${(props) => (props.isActive ? "#1a1b1e" : "transparent")};
  border: none;
  border-bottom: ${(props) => (props.isActive ? "2px solid #00bcd4" : "none")};
  cursor: pointer;
  transition:
    color 0.3s,
    background-color 0.3s;

  &:hover {
    color: #fff;
  }
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
