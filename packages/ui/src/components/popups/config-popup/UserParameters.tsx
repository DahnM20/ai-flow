import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Parameters,
  getConfigParameters,
  updateParameters,
} from "./parameters";
import {
  SocketContext,
  WSConfiguration,
} from "../../../providers/SocketProvider";
import styled from "styled-components";
import ParameterFields from "./ParametersFields";
import { toastFastSuccessMessage } from "../../../utils/toastUtils";

export function UserParameters() {
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
    toastFastSuccessMessage(t("configUpdated"));
  };

  return (
    <>
      <ParametersContainer>
        <ParameterFields
          parameters={parameters}
          onParameterChange={onParameterChange}
        />
      </ParametersContainer>
      <Actions>
        <ActionButton
          onClick={handleValidate}
          className="bg-teal-500 hover:bg-teal-400"
        >
          {t("validateButtonLabel")}
        </ActionButton>
      </Actions>
    </>
  );
}

export const ParametersContainer = styled.div`
  display: flex;
  justify-content: center;
  overflow: auto;
  width: 100%;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
`;
