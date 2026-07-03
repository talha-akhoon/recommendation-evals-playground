import { Injectable, BadRequestException } from '@nestjs/common';
import { headphonesScenario } from '../scenarios/headphones.scenario.js';
import { promptModes } from '../prompts/prompt-modes.js';
import { mockModels } from './mock-models.js';
import {
  calcRecommendationShift,
  calcConfidenceEscalation,
  calcCaveatAsymmetry,
  calcGroundingScore,
} from './evaluators.js';
import type { EvalResult, Scenario } from '../types/eval.types.js';

const scenarios: Record<string, Scenario> = {
  [headphonesScenario.id]: headphonesScenario,
};

@Injectable()
export class EvalsService {
  runEval(scenarioId: string, modelId: string): EvalResult {
    const scenario = scenarios[scenarioId];
    if (!scenario) {
      throw new BadRequestException(`Unknown scenario: ${scenarioId}`);
    }

    const model = mockModels[modelId];
    if (!model) {
      throw new BadRequestException(`Unknown model: ${modelId}`);
    }

    const results = promptModes.map((mode) => model.run(scenario, mode));

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
