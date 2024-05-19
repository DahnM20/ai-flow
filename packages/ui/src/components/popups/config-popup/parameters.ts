import withCache from "../../../api/cache/withCache";
import { getParameters } from "../../../api/parameters";
import { getDefaultNodesHiddenList } from "../../../config/config";

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
export const PARAMETER_NODES_HIDDEN_LIST_KEY_LOCAL_STORAGE = "nodes_hidden";

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
  migrateOldParameters();

  const fetchedParameters = await withCache(getParameters);
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

export function migrateOldParameters() {
  if (!window.localStorage.getItem("apiKeys")) return;

  console.log("Migrating old parameters to new format");

  const oldParameters = JSON.parse(
    window.localStorage.getItem("apiKeys") || "{}",
  );

  const newParams = structuredClone(defaultParameters);

  if (oldParameters.openai_api_key) {
    newParams.core.openai_api_key.value = oldParameters.openai_api_key;
  }
  if (oldParameters.replicate_api_key) {
    newParams.core.replicate_api_key.value = oldParameters.replicate_api_key;
  }
  if (oldParameters.stabilityai_api_key) {
    newParams.core.stabilityai_api_key.value =
      oldParameters.stabilityai_api_key;
  }

  window.localStorage.setItem(
    PARAMETERS_KEY_LOCAL_STORAGE,
    JSON.stringify(newParams),
  );

  window.localStorage.removeItem("apiKeys");

  return newParams;
}

let loadedNodesHiddenList = loadNodesHiddenList();

export function loadNodesHiddenList(): string[] {
  if (
    !window.localStorage.getItem(PARAMETER_NODES_HIDDEN_LIST_KEY_LOCAL_STORAGE)
  )
    return getDefaultNodesHiddenList();
  return JSON.parse(
    window.localStorage.getItem(
      PARAMETER_NODES_HIDDEN_LIST_KEY_LOCAL_STORAGE,
    ) || "[]",
  );
}
export function getNodesHiddenList(): string[] {
  return loadedNodesHiddenList;
}

export function saveNodesHiddenList(nodesHiddenList: string[]) {
  window.localStorage.setItem(
    PARAMETER_NODES_HIDDEN_LIST_KEY_LOCAL_STORAGE,
    JSON.stringify(nodesHiddenList),
  );
  loadedNodesHiddenList = loadNodesHiddenList();
  window.dispatchEvent(new CustomEvent("nodesHiddenListChanged", {}));
}
