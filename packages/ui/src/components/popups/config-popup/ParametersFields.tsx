import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Parameters } from "./parameters";

interface ParameterFieldsProps {
  parameters: Parameters;
  onParameterChange: (
    section: string,
    key: string,
    value: string | number | boolean,
  ) => void;
}

const ParameterFields = ({
  parameters,
  onParameterChange,
}: ParameterFieldsProps) => {
  const { t } = useTranslation("config");

  return (
    <div className="flex w-full flex-col">
      {Object.entries(parameters).map(([section, keys]) => (
        <Section key={section}>
          <SectionTitle>{t(`sections.${section}`)}</SectionTitle>
          {Object.entries(keys).map(([key, { value, type }]) => (
            <Field key={key}>
              <Label htmlFor={`parameter-${section}-${key}`}>
                {t(`parameters.${section}.${key}`)}
              </Label>
              <Input
                type={type === "boolean" ? "checkbox" : "text"}
                id={`parameter-${section}-${key}`}
                value={type === "boolean" ? undefined : value?.toString()}
                checked={type === "boolean" ? (value as boolean) : undefined}
                onChange={(e) =>
                  onParameterChange(
                    section,
                    key,
                    type === "boolean" ? e.target.checked : e.target.value,
                  )
                }
              />
            </Field>
          ))}
        </Section>
      ))}
    </div>
  );
};

export default ParameterFields;

const Section = styled.div`
  margin-bottom: 30px;
  width: 100%;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #d8d8d8;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #b4b4b4;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  width: 100%;
  background-color: #80808012;
  color: #cecece;
`;
