import { Injectable, BadRequestException } from '@nestjs/common';
import { traceable } from 'langsmith/traceable';
import { headphonesScenario } from '../scenarios/headphones.scenario.js';
import { promptModes } from '../prompts/prompt-modes.js';
import { mockModels } from './mock-models.js';
import { OpenAIModel, AnthropicModel } from './llm-models.js';
import { judgeClaimsWithLLM } from './llm-judge.js';
import {
  calcRecommendationShift,
  calcConfidenceEscalation,
  calcCaveatAsymmetry,
  calcGroundingScore,
} from './evaluators.js';
import type { EvalResult, ModelOutput, Scenario } from '../types/eval.types.js';
import type { ModelRunner } from './model-runner.js';

const scenarios: Record<string, Scenario> = {
  [headphonesScenario.id]: headphonesScenario,
};

function buildModelRegistry(): Record<string, ModelRunner> {
  const registry: Record<string, ModelRunner> = { ...mockModels };

  if (process.env.OPENAI_API_KEY) {
    const m = new OpenAIModel();
    registry[m.id] = m;
  }

  if (process.env.ANTHROPIC_API_KEY) {
    const m = new AnthropicModel();
    registry[m.id] = m;
  }

  return registry;
}

@Injectable()
export class EvalsService {
  async runEval(scenarioId: string, modelId: string): Promise<EvalResult> {
    const scenario = scenarios[scenarioId];
    if (!scenario) {
      throw new BadRequestException(`Unknown scenario: ${scenarioId}`);
    }

    const models = buildModelRegistry();
    const model = models[modelId];
    if (!model) {
      throw new BadRequestException(`Unknown model: ${modelId}`);
    }

    const allEvidence = scenario.options.flatMap((o) => o.evidence);
    const isRealLLM = !modelId.startsWith('mock-');

    const runEvaluation = traceable(
      async (): Promise<ModelOutput[]> => {
        const outputs = await Promise.all(
          promptModes.map((mode) => model.run(scenario, mode)),
        );

        if (isRealLLM) {
          return Promise.all(
            outputs.map(async (output) => ({
              ...output,
              claims: await judgeClaimsWithLLM(output.claims, allEvidence),
            })),
          );
        }

        return outputs;
      },
      {
        name: 'runEvaluation',
        run_type: 'chain',
        metadata: { scenarioId, modelId },
      },
    );

    const results = await runEvaluation();

    const unsupportedClaimCount = results.reduce(
      (sum, r) => sum + r.claims.filter((c) => !c.supported).length,
      0,
    );

    return {
      scenario: { id: scenario.id, name: scenario.name },
      model: { id: model.id, name: model.name },
      results,
      summary: {
        recommendationShift: calcRecommendationShift(results),
        confidenceEscalation: calcConfidenceEscalation(results),
        caveatAsymmetry: calcCaveatAsymmetry(results),
        groundingScore: calcGroundingScore(results),
        unsupportedClaimCount,
      },
    };
  }
}
