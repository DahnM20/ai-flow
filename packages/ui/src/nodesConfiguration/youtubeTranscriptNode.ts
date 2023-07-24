import { NodeConfig } from './nodeConfig';

export const youtubeTranscriptNodeConfig: NodeConfig = {
  nodeName: 'YoutubeTranscriptNodeName',
  icon: 'FaFilm',
  fields: [
    {
      name: 'url',
      type: 'input',
      placeholder: "URLPlaceholder",
    },
  ],
  outputType: 'text',
};