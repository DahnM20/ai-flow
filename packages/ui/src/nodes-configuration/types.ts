export type SectionType = "models" | "image-generation" | "tools" | "input";
export type FieldType =
  | "input"
  | "inputInt"
  | "textarea"
  | "select"
  | "option"
  | "inputNameBar"
  | "boolean"
  | "slider"
  | "textfield"
  | "numericfield"
  | "switch";

export type OutputType =
  | "imageUrl"
  | "videoUrl"
  | "audioUrl"
  | "pdfUrl"
  | "imageBase64"
  | "markdown"
  | "text";

export interface Option {
  label: string;
  value: string;
  default?: boolean;
}

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  max?: number;
  min?: number;
  options?: Option[];
  hideIfParent?: boolean;
  required?: boolean;
  hasHandle?: boolean;
  isLinked?: boolean;
  associatedField?: string;
}

export interface NodeConfig {
  processorType?: string;
  nodeName: string;
  icon: string;
  inputNames?: string[];
  fields: Field[];
  hideFieldsIfParent?: boolean;
  outputType: OutputType;
  defaultHideOutput?: boolean;
  hasInputHandle?: boolean;
  section: SectionType;
  helpMessage?: string;
  showHandlesNames?: boolean;
}
