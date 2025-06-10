import { AiOutlineRobot } from "react-icons/ai";
import { BsInputCursorText } from "react-icons/bs";
import { FaToolbox } from "react-icons/fa";
import {
  NodeConfig,
  SectionType,
  SubnodeData,
  SubnodeShortcutStyle,
} from "./types";
import { nodeConfigs } from "./nodeConfig";
import { getNodesHiddenList } from "../components/popups/config-popup/parameters";
import {
  getHighPriorityNodePrefixes,
  getLowPriorityNodePrefixes,
} from "../config/config";
import { DraggableNodeAdditionnalData } from "../components/bars/dnd-sidebar/types";

export type NodeSection = {
  label: string;
  type: SectionType;
  icon?: any;
  nodes?: DnDNode[];
};

export type DnDNode = {
  label: string;
  type: string;
  keywords?: string[];
  helpMessage?: string;
  section: SectionType;
  isBeta?: boolean;
  isNew?: boolean;
  color?: string;
  subnodesShortcutConfig?: SubnodeData[];
  subnodesShortcutStyle?: SubnodeShortcutStyle;
  additionnalData?: DraggableNodeAdditionnalData;
};
export function transformNodeConfigsToDndNode(configs: {
  [key: string]: NodeConfig | undefined;
}): DnDNode[] {
  return Object.entries(configs).map(([type, config]) => {
    return {
      label: config?.nodeName,
      type: type,
      helpMessage: config?.helpMessage || undefined,
      section: config?.section,
      isBeta: config?.isBeta,
    } as DnDNode;
  });
}

export function getNonGenericNodeConfig() {
  const nonGenericNodeConfig: DnDNode[] = [
    {
      label: "File",
      type: "file",
      helpMessage: "fileUploadHelp",
      section: "input",
    },
    {
      label: "AiDataSplitter",
      type: "ai-data-splitter",
      helpMessage: "dataSplitterHelp",
      section: "tools",
    },
    {
      label: "ReplicateModel",
      type: "replicate",
      helpMessage: "replicateHelp",
      section: "models",
      subnodesShortcutConfig: [
        {
          label: "Imagen 4",
          configData: {
            nodeName: "google/imagen-4",
          },
          description: "imagenDescription",
          keywords: [
            "Image Generation",
            "Generate Image",
            "Image",
            "Google Imagen",
          ],
        },

        {
          label: "FLUX Kontext Pro",
          configData: {
            nodeName: "black-forest-labs/flux-kontext-pro",
          },
          description: "fluxKontextDescription",
          keywords: [
            "Image Generation",
            "Generate Image",
            "Image",
            "Edit Image",
          ],
        },
        {
          label: "FLUX 1.1 Pro",
          configData: {
            nodeName: "black-forest-labs/flux-1.1-pro",
          },
          description: "fluxDescription",
          keywords: ["Image Generation", "Generate Image", "Image"],
        },
        {
          label: "Recraft V3",
          configData: {
            nodeName: "recraft-ai/recraft-v3",
          },
          description: "recraftDescription",
          keywords: ["Image Generation", "Generate Image", "Image", "SVG"],
        },
        {
          label: "FLUX Kontext Max",
          configData: {
            nodeName: "black-forest-labs/flux-kontext-max",
          },
          description: "fluxKontextDescription",
          keywords: [
            "Image Generation",
            "Generate Image",
            "Image",
            "Edit Image",
          ],
        },

        {
          label: "Imagen 3",
          configData: {
            nodeName: "google/imagen-3",
          },
          description: "imagenDescription",
          keywords: [
            "Image Generation",
            "Generate Image",
            "Image",
            "Google Imagen",
          ],
        },

        {
          label: "Remove BG",
          configData: {
            nodeName: "lucataco/remove-bg",
          },
          description: "removeBgDescription",
          keywords: ["Image Edit", "Background", "Background removal"],
        },
        {
          label: "Recraft V3 SVG",
          configData: {
            nodeName: "recraft-ai/recraft-v3-svg",
          },
          description: "recraftSVGDescription",
          keywords: ["Image Generation", "Generate Image", "Image", "SVG"],
        },
        {
          label: "Google Upscaler",
          configData: {
            nodeName: "google/upscaler",
          },
          description: "GoogleUpscaleDescription",
          keywords: ["Image Edit", "Edit Image"],
        },
        {
          label: "Upscale Image",
          configData: {
            nodeName: "nightmareai/real-esrgan",
          },
          description: "upscaleDescription",
          keywords: ["Image Edit", "Edit Image"],
        },

        {
          label: "Face Swap",
          configData: {
            nodeName: "lucataco/faceswap",
          },
          description: "faceswapDescription",
          keywords: ["Image Edit", "Edit Image"],
        },
        {
          label: "FLUX 1.1 Pro Ultra",
          configData: {
            nodeName: "black-forest-labs/flux-1.1-pro-ultra",
          },
          description: "fluxDescription",
          keywords: ["Image Generation", "Generate Image", "Image"],
        },

        {
          label: "Imagen 3 Fast",
          configData: {
            nodeName: "google/imagen-3-fast",
          },
          description: "imagenDescription",
          keywords: [
            "Image Generation",
            "Generate Image",
            "Image",
            "Google Imagen",
          ],
        },
        {
          label: "FLUX Dev",
          configData: {
            nodeName: "black-forest-labs/flux-dev",
          },
          description: "fluxDescription",
          keywords: ["Image Generation", "Generate Image", "Image"],
        },
        {
          label: "FLUX Schnell",
          configData: {
            nodeName: "black-forest-labs/flux-schnell",
          },
          description: "fluxDescription",
          keywords: ["Image Generation", "Generate Image", "Image"],
        },
        {
          label: "Google Veo 3",
          configData: {
            nodeName: "google/veo-3",
          },
          description: "veo3Description",
          keywords: ["Video", "Generate Video"],
        },
        {
          label: "Video-01",
          configData: {
            nodeName: "minimax/video-01",
          },
          description: "video01Description",
          keywords: ["Video", "Hailuo", "Minimax", "Generate Video", "Animate"],
        },
        {
          label: "Video-01-Live",
          configData: {
            nodeName: "minimax/video-01-live",
          },
          description: "video01LiveDescription",
          keywords: [
            "Video",
            "Hailuo",
            "Minimax",
            "Generate Video",
            "Animate",
            "Animation",
          ],
        },
        {
          label: "Kling v1.6 Pro",
          configData: {
            nodeName: "kwaivgi/kling-v1.6-pro",
          },
          description: "klingDescription",
          keywords: ["Video", "Generate Video", "Animate"],
        },
        {
          label: "Kling v1.6",
          configData: {
            nodeName: "kwaivgi/kling-v1.6-standard",
          },
          description: "klingDescription",
          keywords: ["Video", "Generate Video", "Animate"],
        },
        {
          label: "Play-Dialog",
          configData: {
            nodeName: "playht/play-dialog",
          },
          description: "playDialogDescription",
          keywords: ["Audio", "Generate Audio", "Voice", "TTS", "Conversation"],
        },
        {
          label: "Music-01",
          configData: {
            nodeName: "minimax/music-01",
          },
          description: "music01Description",
          keywords: ["Audio", "Generate Audio", "Music", "Song", "Sound"],
        },
        {
          label: "Speech-02 HD",
          configData: {
            nodeName: "minimax/speech-02-hd",
          },
          description: "music01Description",
          keywords: ["Audio", "Generate Speech", "Voice", "Sound"],
        },
        {
          label: "Speech-02 Turbo",
          configData: {
            nodeName: "minimax/speech-02-turbo",
          },
          description: "music01Description",
          keywords: ["Audio", "Generate Speech", "Voice", "Sound"],
        },
        {
          label: "Face Expression Edit",
          configData: {
            nodeName: "fofr/expression-editor",
          },
          description: "expressionEditorDescription",
          keywords: ["Image Edit", "Edit Image", "Face"],
        },
      ],
    },
    {
      label: "Transition",
      type: "transition",
      helpMessage: "transitionHelp",
      section: "tools",
    },
    {
      label: "Display",
      type: "display",
      helpMessage: "displayHelp",
      section: "tools",
    },
  ];
  return nonGenericNodeConfig;
}

function getAllDndNode(): DnDNode[] {
  const nodesDisabled = getNodesHiddenList();
  const nonGenericNodeConfig = getNonGenericNodeConfig();
  return transformNodeConfigsToDndNode(nodeConfigs)
    .concat(nonGenericNodeConfig)
    .filter((node) => !nodesDisabled.includes(node.type));
}

export const populateNodeSections = () => {
  const emptyNodeSections: NodeSection[] = [
    {
      label: "Input",
      type: "input",
      icon: BsInputCursorText,
    },
    {
      label: "Models",
      type: "models",
      icon: AiOutlineRobot,
    },
    {
      label: "Tools",
      type: "tools",
      icon: FaToolbox,
    },
  ];
  const nodes = getAllDndNode();

  nodes.forEach((node) => {
    const section = emptyNodeSections.find((sec) => sec.type === node.section);

    if (section) {
      if (!section.nodes) {
        section.nodes = [];
      }
      section.nodes.push(node);
    }
  });

  const sectionFiltered = emptyNodeSections.filter(
    (sec) => sec.nodes && sec.nodes.length > 0,
  );

  for (const sec of sectionFiltered) {
    if (sec.type === "models") sortSection(sec);
  }

  return sectionFiltered;
};

export function sortSection(
  section: NodeSection,
  lowPriorityPrefixes?: string[],
  highPriorityPrefixes?: string[],
) {
  const lowPriority = lowPriorityPrefixes ?? getLowPriorityNodePrefixes();
  const highPriority = highPriorityPrefixes ?? getHighPriorityNodePrefixes();

  if (section.nodes) {
    section.nodes.sort((a, b) => {
      const getHighPriorityRank = (type: string): number => {
        for (let i = 0; i < highPriority.length; i++) {
          if (type.startsWith(highPriority[i])) {
            return i;
          }
        }
        return -1;
      };

      const isLowPriority = (label: string): boolean =>
        lowPriority.some((prefix: string) =>
          label.toLowerCase().startsWith(prefix.toLowerCase()),
        );

      const aHighRank = getHighPriorityRank(a.type);
      const bHighRank = getHighPriorityRank(b.type);
      const aLow = isLowPriority(a.type);
      const bLow = isLowPriority(b.type);

      // Low priority always goes last
      if (aLow && !bLow) return 1;
      if (!aLow && bLow) return -1;

      // High priority comes first, sorted by priority rank
      if (aHighRank !== -1 && bHighRank !== -1) {
        return aHighRank - bHighRank;
      }
      if (aHighRank !== -1) return -1;
      if (bHighRank !== -1) return 1;

      // All remaining items sorted alphabetically by label
      return a.label.localeCompare(b.label);
    });
  }
}

export const getSections = () => populateNodeSections();
