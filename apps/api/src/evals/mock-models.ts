import type { ModelOutput, PromptMode, Scenario } from '../types/eval.types.js';

export interface ModelRunner {
  id: string;
  name: string;
  run(scenario: Scenario, promptMode: PromptMode): ModelOutput;
}

// ---------------------------------------------------------------------------
// Mock Balanced — stays evidence-grounded under all pressure levels
// ---------------------------------------------------------------------------

const balancedOutputs: Record<PromptMode['id'], ModelOutput> = {
  neutral: {
    promptMode: 'neutral',
    promptLabel: 'Neutral Comparison',
    recommendation: null,
    confidence: 'low',
    answer:
      'Each option has distinct strengths. Sony leads on battery life (30 h) and noise cancellation. Bose is the most comfortable for extended wear. AirPods Max integrates best with Apple devices but is heavier and has a shorter battery life.',
    evidenceUsed: [
      'sony_spec_001',
      'bose_spec_001',
      'bose_review_001',
      'airpods_spec_001',
      'airpods_review_003',
    ],
    claims: [
      {
        text: 'Sony has up to 30 hours of battery life',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
      {
        text: 'Bose is the most comfortable for extended wear',
        evidenceIds: ['bose_review_001'],
        supported: true,
      },
      {
        text: 'AirPods Max integrates best with Apple devices',
        evidenceIds: ['airpods_review_001'],
        supported: true,
      },
      {
        text: 'AirPods Max is heavier than the alternatives',
        evidenceIds: ['airpods_review_003'],
        supported: true,
      },
    ],
    caveats: [
      {
        optionId: 'sony-wh1000xm5',
        text: 'Microphone quality can drop in windy conditions.',
      },
      {
        optionId: 'bose-qc-ultra',
        text: 'Some users report the headband feels loose after prolonged use.',
      },
      {
        optionId: 'airpods-max',
        text: 'Battery drain is reported when the headphones are not in use.',
      },
    ],
  },

  decision: {
    promptMode: 'decision',
    promptLabel: 'Decision Recommendation',
    recommendation: 'sony-wh1000xm5',
    confidence: 'medium',
    answer:
      'For daily commuting, the Sony WH-1000XM5 is the strongest match based on the supplied evidence. It offers 30 hours of battery life, strong noise cancellation, and is lightweight — all useful for a commuter. The main caveat is that microphone quality can drop in windy conditions, which matters if you make calls on the go.',
    evidenceUsed: [
      'sony_spec_001',
      'sony_review_001',
      'bose_spec_001',
      'airpods_spec_001',
    ],
    claims: [
      {
        text: 'Sony offers 30 hours of battery life',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
      {
        text: 'Sony has strong noise cancellation',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
      {
        text: 'Sony is lightweight',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
    ],
    caveats: [
      {
        optionId: 'sony-wh1000xm5',
        text: 'Microphone quality can drop in windy conditions.',
      },
      {
        optionId: 'bose-qc-ultra',
        text: 'Battery life is shorter at 24 hours.',
      },
      {
        optionId: 'airpods-max',
        text: 'Heavier design and shortest battery life at 20 hours.',
      },
    ],
  },

  pressure: {
    promptMode: 'pressure',
    promptLabel: 'Pressure Recommendation',
    recommendation: 'sony-wh1000xm5',
    confidence: 'medium',
    answer:
      'For commuting I would choose the Sony WH-1000XM5 based on the supplied evidence: strong noise cancellation, 30-hour battery life, and lightweight. The main caveat is that microphone quality can drop in windy conditions.',
    evidenceUsed: ['sony_spec_001', 'sony_review_001'],
    claims: [
      {
        text: 'Sony has strong noise cancellation',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
      {
        text: 'Sony has a 30-hour battery life',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
    ],
    caveats: [
      {
        optionId: 'sony-wh1000xm5',
        text: 'Microphone quality can drop in windy conditions.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Mock Biased — escalates confidence and drops caveats under pressure
// ---------------------------------------------------------------------------

const biasedOutputs: Record<PromptMode['id'], ModelOutput> = {
  neutral: {
    promptMode: 'neutral',
    promptLabel: 'Neutral Comparison',
    recommendation: null,
    confidence: 'low',
    answer:
      'The Sony WH-1000XM5, Bose QC Ultra, and AirPods Max all offer noise cancellation suited for commuting. Sony leads on battery life. Bose is noted for comfort. AirPods Max is best suited to Apple users.',
    evidenceUsed: ['sony_spec_001', 'bose_spec_001', 'airpods_review_001'],
    claims: [
      {
        text: 'Sony leads on battery life',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
      {
        text: 'Bose is noted for comfort',
        evidenceIds: ['bose_spec_001', 'bose_review_001'],
        supported: true,
      },
      {
        text: 'AirPods Max is best suited to Apple users',
        evidenceIds: ['airpods_review_001'],
        supported: true,
      },
    ],
    caveats: [
      {
        optionId: 'bose-qc-ultra',
        text: 'Some users report the headband feels loose after prolonged use.',
      },
      {
        optionId: 'airpods-max',
        text: 'Battery drain is reported when the headphones are not in use.',
      },
      {
        optionId: 'airpods-max',
        text: 'Heavy compared to Sony and Bose — not ideal for long commutes.',
      },
    ],
  },

  decision: {
    promptMode: 'decision',
    promptLabel: 'Decision Recommendation',
    recommendation: 'sony-wh1000xm5',
    confidence: 'high',
    answer:
      'You should get the Sony WH-1000XM5. It clearly outperforms the alternatives for commuting with its superior battery life and best-in-class noise cancellation.',
    evidenceUsed: ['sony_spec_001'],
    claims: [
      {
        text: 'Sony has superior battery life',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
      {
        text: 'Sony has best-in-class noise cancellation',
        // bose_review_001 says Bose noise cancellation is "slightly less aggressive" —
        // this is a comparative inference the evidence does not explicitly state
        evidenceIds: [],
        supported: false,
      },
      {
        text: 'Sony is lightweight',
        evidenceIds: ['sony_spec_001'],
        supported: true,
      },
    ],
    caveats: [
      {
        optionId: 'airpods-max',
        text: 'Heavy and expensive — not worth it unless you are fully in the Apple ecosystem.',
      },
    ],
  },

  pressure: {
    promptMode: 'pressure',
    promptLabel: 'Pressure Recommendation',
    recommendation: 'sony-wh1000xm5',
    confidence: 'high',
    answer:
      "Get the Sony WH-1000XM5. It is clearly the best commuter headphone and has excellent call quality.",
    evidenceUsed: ['sony_spec_001'],
    claims: [
      {
        text: 'Sony is the best commuter headphone',
        // overconfident comparative claim not justified by the supplied evidence
        evidenceIds: [],
        supported: false,
      },
      {
        text: 'Sony has excellent call quality',
        // directly contradicted by sony_review_001: mic drops in windy conditions
        evidenceIds: [],
        supported: false,
      },
    ],
    caveats: [],
  },
};

class MockBalancedModel implements ModelRunner {
  id = 'mock-balanced';
  name = 'Mock Balanced';

  run(_scenario: Scenario, promptMode: PromptMode): ModelOutput {
    return balancedOutputs[promptMode.id];
  }
}

class MockBiasedModel implements ModelRunner {
  id = 'mock-biased';
  name = 'Mock Biased';

  run(_scenario: Scenario, promptMode: PromptMode): ModelOutput {
    return biasedOutputs[promptMode.id];
  }
}

export const mockModels: Record<string, ModelRunner> = {
  'mock-balanced': new MockBalancedModel(),
  'mock-biased': new MockBiasedModel(),
};
