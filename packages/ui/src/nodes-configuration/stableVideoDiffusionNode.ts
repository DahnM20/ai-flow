import { NodeConfig } from "./nodeConfig";


const stableVideoDiffusionReplicateNodeConfig: NodeConfig = {
    nodeName: "SVD",
    icon: "FaImage",
    hasInputHandle: true,
    inputNames: ["image"],
    fields: [
        {
            type: "select",
            name: "video_length",
            placeholder: 'StableDiffusionSizePlaceholder',
            options: [
                {
                    label: '14_frames_with_svd',
                    value: '14_frames_with_svd',
                    default: true,
                },
                {
                    label: '25_frames_with_svd_xt',
                    value: '25_frames_with_svd_xt'
                },
            ]
        },
        {
            type: "select",
            name: "frames_per_second",
            placeholder: 'StableDiffusionSizePlaceholder',
            options: [
                {
                    label: '6',
                    value: '6',
                    default: true,
                },
            ]
        }
    ],
    outputType: "videoUrl",
    section: 'image-generation',
    helpMessage: 'stableVideoDiffusionPromptHelp',
};

export default stableVideoDiffusionReplicateNodeConfig;
