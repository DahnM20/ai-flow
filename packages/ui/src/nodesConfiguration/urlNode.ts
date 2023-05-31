import { NodeConfig } from './nodeConfig';

export const urlNodeConfig: NodeConfig = {
  nodeName: 'EnterURL',
  icon: 'FaLink',
  fields: [
    {
      name: 'url',
      type: 'input',
      label: '',
    },
  ],
  outputType: 'text',
};