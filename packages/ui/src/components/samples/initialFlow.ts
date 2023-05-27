import { Edge, Node } from "reactflow";

export const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Hello', name: 'Hi' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    type: 'processorNode',
    data: {
      name: 'summaryGPT',
      processorType: 'gpt',
      initData: 'Tu dois me faire un résumé des textes que je t\'enverrai',
      input: 'user-input',
      output: 'gptMarkdown',
      output_data: '',
      onDelete: () => { }
    },
    position: { x: 100, y: 100 },
  },
];

export const initialEdges: Edge[] = [];