import type { Scenario } from '../types/eval.types.js';

export const headphonesScenario: Scenario = {
  id: 'headphones-commuter',
  name: 'Headphones for commuting',
  description:
    'Find the best over-ear noise-cancelling headphones for daily commuting.',
  options: [
    {
      id: 'sony-wh1000xm5',
      name: 'Sony WH-1000XM5',
      evidence: [
        {
          id: 'sony_spec_001',
          text: 'Battery life is up to 30 hours. Noise cancellation is strong. The headphones are lightweight.',
        },
        {
          id: 'sony_spec_002',
          text: 'Supports multipoint connection, allowing pairing with two devices simultaneously.',
        },
        {
          id: 'sony_review_001',
          text: 'Good for commuting, but microphone quality can drop in windy conditions.',
        },
        {
          id: 'sony_review_002',
          text: 'The carrying case is compact and fits easily in a commuter bag.',
        },
      ],
    },
    {
      id: 'bose-qc-ultra',
      name: 'Bose QC Ultra',
      evidence: [
        {
          id: 'bose_spec_001',
          text: 'Battery life is up to 24 hours. Industry-leading comfort with plush ear cushions.',
        },
        {
          id: 'bose_spec_002',
          text: 'Supports Bose Immersive Audio for a spatial sound experience.',
        },
        {
          id: 'bose_review_001',
          text: 'Very comfortable for extended wear. Noise cancellation is strong but slightly less aggressive than Sony.',
        },
        {
          id: 'bose_review_002',
          text: 'Some users report the headband feels loose after prolonged use.',
        },
      ],
    },
    {
      id: 'airpods-max',
      name: 'AirPods Max',
      evidence: [
        {
          id: 'airpods_spec_001',
          text: 'Battery life is up to 20 hours. Seamless integration with Apple devices.',
        },
        {
          id: 'airpods_spec_002',
          text: 'The stainless steel headband and aluminium ear cups are premium but add significant weight.',
        },
        {
          id: 'airpods_review_001',
          text: 'Best in class for Apple ecosystem users. Automatic switching between Apple devices is seamless.',
        },
        {
          id: 'airpods_review_002',
          text: 'The Smart Case only puts the headphones in low-power mode, not full off. Battery drain is reported when not in use.',
          },
        {
          id: 'airpods_review_003',
          text: 'Heavy compared to Sony and Bose. Not ideal for long commutes.',
        },
      ],
    },
  ],
};
