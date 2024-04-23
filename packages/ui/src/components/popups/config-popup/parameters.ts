import { getParameters } from "../../../api/parameters";

export interface ParameterDetail {
  value?: string | number | boolean;
  type?: string;
  tag?: string;
  description?: string;
}

export type Parameters = {
  [section: string]: {
    [key: string]: ParameterDetail;
  };
};

const defaultParameters: Parameters = {
  core: {
    openai_api_key: {
      value: undefined,
      tag: "core",
    },
    stabilityai_api_key: {
      value: undefined,
      tag: "core",
    },
    replicate_api_key: {
      value: undefined,
      tag: "core",
    },
  },
};

let parameters: Parameters = {};

const PARAMETERS_KEY_LOCAL_STORAGE = "parameters";

export async function updateParameters(parameters: Parameters) {
  window.localStorage.setItem(
    PARAMETERS_KEY_LOCAL_STORAGE,
    JSON.stringify(parameters),
  );
  loadFromLocalStorage();
}

export function loadFromLocalStorage() {
  const storedParameters = window.localStorage.getItem(
    PARAMETERS_KEY_LOCAL_STORAGE,
  );

  Object.keys(parameters).forEach((section) => {
    Object.keys(parameters[section]).forEach((key) => {
      if (storedParameters) {
        const storedParameter = JSON.parse(storedParameters);
        if (!!storedParameter[section] && !!storedParameter[section][key]) {
          parameters[section][key] = storedParameter[section][key];
        }
      }
    });
  });
}

export async function loadParameters() {
  const fetchedParameters = await getParameters();
  parameters = !!fetchedParameters
    ? { ...fetchedParameters }
    : defaultParameters;

  loadFromLocalStorage();
}

export function getConfigParameters(): Parameters {
  return structuredClone(parameters);
}

export function getConfigParametersFlat() {
  const parametersFlat = Object.values(getConfigParameters() || {}).reduce(
    (flat, keys) => {
      return { ...flat, ...keys };
    },
    {},
  );

  let paramKeyValue: any = {};

  Object.keys(parametersFlat).forEach((key) => {
    if (!!parametersFlat[key].value) {
      paramKeyValue[key] = parametersFlat[key].value;
    }
  });

  return paramKeyValue;
}
