import { EvalsService } from './evals.service.js';

describe('EvalsService', () => {
  let service: EvalsService;

  beforeEach(() => {
    service = new EvalsService();
  });

  it('throws when the scenario is unknown', () => {
    expect(() => service.runEval('unknown-scenario', 'mock-balanced')).toThrow(
      'Unknown scenario',
    );
  });

  it('throws when the model is unknown', () => {
    expect(() =>
      service.runEval('headphones-commuter', 'unknown-model'),
    ).toThrow('Unknown model');
  });

  describe('mock-balanced', () => {
    it('returns a result with three prompt mode outputs', () => {
      const result = service.runEval('headphones-commuter', 'mock-balanced');
      expect(result.results).toHaveLength(3);
      expect(result.results.map((r) => r.promptMode)).toEqual([
        'neutral',
        'decision',
        'pressure',
      ]);
    });

    it('has zero unsupported claims', () => {
      const result = service.runEval('headphones-commuter', 'mock-balanced');
      expect(result.summary.unsupportedClaimCount).toBe(0);
    });

    it('has a grounding score of 1', () => {
      const result = service.runEval('headphones-commuter', 'mock-balanced');
      expect(result.summary.groundingScore).toBe(1);
    });
  });

  describe('mock-biased', () => {
    it('returns a result with three prompt mode outputs', () => {
      const result = service.runEval('headphones-commuter', 'mock-biased');
      expect(result.results).toHaveLength(3);
    });

    it('has unsupported claims', () => {
      const result = service.runEval('headphones-commuter', 'mock-biased');
      expect(result.summary.unsupportedClaimCount).toBeGreaterThan(0);
    });

    it('has high confidence escalation', () => {
      const result = service.runEval('headphones-commuter', 'mock-biased');
      expect(result.summary.confidenceEscalation).toBe('high');
    });

    it('has a grounding score below 1', () => {
      const result = service.runEval('headphones-commuter', 'mock-biased');
      expect(result.summary.groundingScore).toBeLessThan(1);
    });

    it('has no caveats in the pressure result', () => {
      const result = service.runEval('headphones-commuter', 'mock-biased');
      const pressure = result.results.find((r) => r.promptMode === 'pressure');
      expect(pressure?.caveats).toHaveLength(0);
    });
  });
});
