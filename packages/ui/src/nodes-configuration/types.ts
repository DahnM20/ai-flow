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
  | "switch"
  | "textToDisplay"
  | "list"
  | "json"
  | "nonRendered"
  | "dictionnary"
  | "fileUpload"
  | "imageMaskCreator";

export type OutputType =
  | "imageUrl"
  | "videoUrl"
  | "audioUrl"
  | "pdfUrl"
  | "imageBase64"
  | "markdown"
  | "text"
  | "fileUrl"
  | "3dUrl";

export interface Option {
  label: string;
  value: string;
  default?: boolean;
}

export type Operator =
  | "equals"
  | "not equals"
  | "in"
  | "not in"
  | "greater than"
  | "less than"
  | "exists"
  | "not exists";

export interface Condition {
  field: string;
  operator: Operator;
  value: any;
}

export interface ConditionGroup {
  logic: "AND" | "OR";
  conditions: Condition[];
}

export type FieldCondition = Condition | ConditionGroup;

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: string | number | string[] | number[];
  max?: number;
  min?: number;
  step?: number;
  allowDecimal?: boolean;
  options?: Option[];
  hideIfParent?: boolean;
  required?: boolean;
  hidden?: boolean;
  hasHandle?: boolean;
  isLinked?: boolean;
  associatedField?: string;
  description?: string;
  isBinary?: boolean;
  withModalEdit?: boolean;
  condition?: FieldCondition;
  canAddChildrenFields?: boolean;
  isChild?: boolean;
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
  isDynamicallyGenerated?: boolean;
  isBeta?: boolean;
}

export interface DiscriminatedNodeConfig {
  discriminators: { [key: string]: string };
  config: NodeConfig;
}

export interface NodeSubConfig {
  discriminatorFields: string[];
  subConfigurations: DiscriminatedNodeConfig[];
}

export type NodeConfigVariant = NodeSubConfig &
  Omit<NodeConfig, "fields" | "outputType">;
