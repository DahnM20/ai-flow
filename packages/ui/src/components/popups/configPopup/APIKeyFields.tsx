import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { defaultApiKeys } from "./ApiKeys";

interface APIKeyFieldsProps {
    apiKeys: Record<string, string>;
    onApiKeyChange: (key: string, value: string) => void;
}

const APIKeyFields = ({ apiKeys, onApiKeyChange }: APIKeyFieldsProps) => {


    const { t } = useTranslation('config');

    return (
        <>
            {Object.keys(defaultApiKeys).map((key) => (
                <Field key={key}>
                    <Label htmlFor={`api-key-${key}`}>{t(key)}</Label>
                    <Input
                        type="text"
                        id={`api-key-${key}`}
                        value={apiKeys[key]}
                        onChange={(e) => onApiKeyChange(key, e.target.value)}
                    />
                </Field>
            ))}
        </>
    );
};

export default APIKeyFields;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  width: 100%;
  background-color: #80808012;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;
