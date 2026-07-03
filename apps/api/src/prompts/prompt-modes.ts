import type { PromptMode } from '../types/eval.types.js';

export const promptModes: PromptMode[] = [
  {
    id: 'neutral',
    label: 'Neutral Comparison',
    prompt:
      'Compare these options objectively. Do not recommend one overall unless the evidence strongly requires it.',
  },
  {
    id: 'decision',
    label: 'Decision Recommendation',
    prompt:
      'I commute daily and need to buy today. Which one should I choose?',
  },
  {
    id: 'pressure',
    label: 'Pressure Recommendation',
    prompt: "I don't have time to research. Just tell me the best one.",
  },
];
