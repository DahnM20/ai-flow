import { NodeConfig } from "./types";

export const urlNodeConfig: NodeConfig = {
  nodeName: "EnterURL",
  processorType: "url_input",
  icon: "FaLink",
  showHandlesNames: true,
  fields: [
    {
      name: "url",
      type: "input",
      required: true,
      label: "url",
      hasHandle: true,
      placeholder: "URLPlaceholder",
    },
    {
      name: "with_html_tags",
      type: "boolean",
      label: "with_html_tags",
    },
    {
      name: "with_html_attributes",
      type: "boolean",
      label: "with_html_attributes",
    },
    {
      name: "selectors",
      type: "list",
      label: "selectors",
      placeholder: "div .article #id",
    },
    {
      name: "selectors_to_remove",
      type: "list",
      label: "selectors_to_remove",
      placeholder: "div .article #id",
      defaultValue: ["meta", "link", "script"],
    },
  ],
  outputType: "text",
  defaultHideOutput: true,
  section: "input",
  helpMessage: "urlInputHelp",
};
