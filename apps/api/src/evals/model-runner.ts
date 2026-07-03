import type { ModelOutput, PromptMode, Scenario } from '../types/eval.types.js';

export interface ModelRunner {
  id: string;
  name: string;
  run(scenario: Scenario, promptMode: PromptMode): Promise<ModelOutput>;
}
