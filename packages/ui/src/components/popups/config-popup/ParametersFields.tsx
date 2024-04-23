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
    <>
      {Object.entries(parameters).map(([section, keys]) => (
        <Section key={section} className="w-full">
          <SectionTitle>{t(`sections.${section}`)}</SectionTitle>
          {Object.entries(keys).map(([key, { value, type }]) => (
            <Field key={key} className="text-zinc-800">
              <Label htmlFor={`parameter-${section}-${key}`}>
                {t(`parameters.${section}.${key}`)}
              </Label>
              <Input
                type={type === "boolean" ? "checkbox" : "text"}
                id={`parameter-${section}-${key}`}
                value={type === "boolean" ? undefined : value?.toString()}
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
    </>
  );
};

export default ParameterFields;

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

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;
