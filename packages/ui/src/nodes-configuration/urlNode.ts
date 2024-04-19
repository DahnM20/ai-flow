import { NodeConfig } from "./types";

export const urlNodeConfig: NodeConfig = {
  nodeName: "EnterURL",
  processorType: "url_input",
  icon: "FaLink",
  fields: [
    {
      name: "url",
      type: "input",
      required: true,
      placeholder: "URLPlaceholder",
    },
  ],
  outputType: "text",
  defaultHideOutput: true,
  section: "input",
  helpMessage: "urlInputHelp",
};
