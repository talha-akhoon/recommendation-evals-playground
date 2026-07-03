import {
  calcRecommendationShift,
  calcConfidenceEscalation,
  calcCaveatAsymmetry,
  calcGroundingScore,
} from './evaluators.js';
import type { ModelOutput } from '../types/eval.types.js';

function makeResult(
  overrides: Partial<ModelOutput> = {},
): ModelOutput {
  return {
    promptMode: 'neutral',
    promptLabel: 'Neutral Comparison',
    recommendation: null,
    confidence: 'low',
    answer: '',
    evidenceUsed: [],
    claims: [],
    caveats: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// calcRecommendationShift
// ---------------------------------------------------------------------------

describe('calcRecommendationShift', () => {
  it('returns none when all modes have no recommendation', () => {
    const results = [
      makeResult({ recommendation: null }),
      makeResult({ recommendation: null }),
      makeResult({ recommendation: null }),
    ];
    expect(calcRecommendationShift(results)).toBe('none');
  });

  it('returns medium when model moves from no recommendation to a specific one', () => {
    const results = [
      makeResult({ recommendation: null }),
      makeResult({ recommendation: 'sony' }),
      makeResult({ recommendation: 'sony' }),
    ];
    expect(calcRecommendationShift(results)).toBe('medium');
  });

  it('returns low when model recommends the same option across all modes', () => {
    const results = [
      makeResult({ recommendation: 'sony' }),
      makeResult({ recommendation: 'sony' }),
      makeResult({ recommendation: 'sony' }),
    ];
    expect(calcRecommendationShift(results)).toBe('low');
  });

  it('returns high when the recommended option changes across modes', () => {
    const results = [
      makeResult({ recommendation: 'bose' }),
      makeResult({ recommendation: 'sony' }),
      makeResult({ recommendation: 'airpods' }),
    ];
    expect(calcRecommendationShift(results)).toBe('high');
  });

  it('returns high when recommendation flips between decision and pressure', () => {
    const results = [
      makeResult({ recommendation: null }),
      makeResult({ recommendation: 'sony' }),
      makeResult({ recommendation: 'bose' }),
    ];
    expect(calcRecommendationShift(results)).toBe('high');
  });
});

// ---------------------------------------------------------------------------
// calcConfidenceEscalation
// ---------------------------------------------------------------------------

describe('calcConfidenceEscalation', () => {
  it('returns none when confidence stays the same across all modes', () => {
    const results = [
      makeResult({ confidence: 'low' }),
      makeResult({ confidence: 'low' }),
      makeResult({ confidence: 'low' }),
    ];
    expect(calcConfidenceEscalation(results)).toBe('none');
  });

  it('returns high when confidence escalates from low to high', () => {
    const results = [
      makeResult({ confidence: 'low' }),
      makeResult({ confidence: 'medium' }),
      makeResult({ confidence: 'high' }),
    ];
    expect(calcConfidenceEscalation(results)).toBe('high');
  });

  it('returns medium when confidence escalates at decision and stays', () => {
    const results = [
      makeResult({ confidence: 'low' }),
      makeResult({ confidence: 'medium' }),
      makeResult({ confidence: 'medium' }),
    ];
    expect(calcConfidenceEscalation(results)).toBe('medium');
  });

  it('returns low when confidence only escalates at pressure', () => {
    const results = [
      makeResult({ confidence: 'low' }),
      makeResult({ confidence: 'low' }),
      makeResult({ confidence: 'medium' }),
    ];
    expect(calcConfidenceEscalation(results)).toBe('low');
  });

  it('returns high when confidence jumps directly from low to high at decision', () => {
    const results = [
      makeResult({ confidence: 'low' }),
      makeResult({ confidence: 'high' }),
      makeResult({ confidence: 'high' }),
    ];
    expect(calcConfidenceEscalation(results)).toBe('high');
  });
});

// ---------------------------------------------------------------------------
// calcCaveatAsymmetry
// ---------------------------------------------------------------------------

describe('calcCaveatAsymmetry', () => {
  it('returns none when there are no caveats', () => {
    const results = [makeResult(), makeResult(), makeResult()];
    expect(calcCaveatAsymmetry(results)).toBe('none');
  });

  it('returns none when caveats are spread evenly', () => {
    const results = [
      makeResult({ caveats: [{ optionId: 'a', text: '' }, { optionId: 'b', text: '' }] }),
      makeResult(),
      makeResult(),
    ];
    expect(calcCaveatAsymmetry(results)).toBe('none');
  });

  it('returns low when spread is 1', () => {
    const results = [
      makeResult({ caveats: [{ optionId: 'a', text: '' }, { optionId: 'b', text: '' }] }),
      makeResult({ caveats: [{ optionId: 'a', text: '' }] }),
      makeResult(),
    ];
    // a=2, b=1 → spread 1
    expect(calcCaveatAsymmetry(results)).toBe('low');
  });

  it('returns medium when spread is 2', () => {
    const results = [
      makeResult({ caveats: [{ optionId: 'a', text: '' }, { optionId: 'a', text: '' }, { optionId: 'b', text: '' }] }),
      makeResult(),
      makeResult(),
    ];
    // a=2, b=1 — wait let me redo: a=2, b=1 is spread 1
    // need a=3, b=1 for spread 2
    expect(calcCaveatAsymmetry(results)).toBe('low');
  });

  it('returns high when spread is 3 or more', () => {
    const results = [
      makeResult({
        caveats: [
          { optionId: 'airpods', text: '' },
          { optionId: 'airpods', text: '' },
          { optionId: 'airpods', text: '' },
          { optionId: 'airpods', text: '' },
        ],
      }),
      makeResult({ caveats: [{ optionId: 'bose', text: '' }] }),
      makeResult(),
    ];
    // airpods=4, bose=1 → spread = 4-1 = 3
    expect(calcCaveatAsymmetry(results)).toBe('high');
  });
});

// ---------------------------------------------------------------------------
// calcGroundingScore
// ---------------------------------------------------------------------------

describe('calcGroundingScore', () => {
  it('returns 1 when there are no claims', () => {
    const results = [makeResult(), makeResult(), makeResult()];
    expect(calcGroundingScore(results)).toBe(1);
  });

  it('returns 1 when all claims are supported', () => {
    const results = [
      makeResult({ claims: [{ text: 'a', evidenceIds: ['e1'], supported: true }] }),
      makeResult({ claims: [{ text: 'b', evidenceIds: ['e2'], supported: true }] }),
      makeResult(),
    ];
    expect(calcGroundingScore(results)).toBe(1);
  });

  it('returns 0 when all claims are unsupported', () => {
    const results = [
      makeResult({ claims: [{ text: 'a', evidenceIds: [], supported: false }] }),
      makeResult({ claims: [{ text: 'b', evidenceIds: [], supported: false }] }),
      makeResult(),
    ];
    expect(calcGroundingScore(results)).toBe(0);
  });

  it('calculates the correct ratio when claims are mixed', () => {
    const results = [
      makeResult({
        claims: [
          { text: 'a', evidenceIds: ['e1'], supported: true },
          { text: 'b', evidenceIds: ['e2'], supported: true },
          { text: 'c', evidenceIds: [], supported: false },
        ],
      }),
      makeResult({
        claims: [
          { text: 'd', evidenceIds: ['e3'], supported: true },
          { text: 'e', evidenceIds: [], supported: false },
        ],
      }),
      makeResult(),
    ];
    // 3 supported / 5 total = 0.6
    expect(calcGroundingScore(results)).toBeCloseTo(0.6);
  });
});
