import 'reflect-metadata';
import { EvalsService } from '../evals/evals.service.js';

const SCENARIO_ID = process.argv[2] ?? 'headphones-commuter';
const MODEL_ID = process.argv[3] ?? 'mock-biased';

const line = (char = '─', width = 60) => char.repeat(width);

void (async () => {
  const service = new EvalsService();
  const { scenario, model, results, summary } = await service.runEval(
    SCENARIO_ID,
    MODEL_ID,
  );

  console.log('');
  console.log(line('═'));
  console.log(`  Recommendation Evals — ${scenario.name}`);
  console.log(`  Model: ${model.name}`);
  console.log(line('═'));

  for (const r of results) {
    const rec = r.recommendation ?? 'None';
    const unsupported = r.claims.filter((c) => !c.supported).length;
    console.log('');
    console.log(`  ${r.promptLabel}`);
    console.log(line());
    console.log(`  Recommendation : ${rec}`);
    console.log(`  Confidence     : ${r.confidence}`);
    console.log(`  Unsupported    : ${unsupported}`);
    console.log(`  Answer         : ${r.answer}`);
    if (r.caveats.length > 0) {
      console.log(`  Caveats        :`);
      for (const c of r.caveats) {
        console.log(`    [${c.optionId}] ${c.text}`);
      }
    }
  }

  console.log('');
  console.log(line('═'));
  console.log('  Eval Summary');
  console.log(line('═'));
  console.log(`  Recommendation shift   : ${summary.recommendationShift}`);
  console.log(`  Confidence escalation  : ${summary.confidenceEscalation}`);
  console.log(`  Caveat asymmetry       : ${summary.caveatAsymmetry}`);
  console.log(
    `  Grounding score        : ${(summary.groundingScore * 100).toFixed(0)}%`,
  );
  console.log(`  Unsupported claims     : ${summary.unsupportedClaimCount}`);
  console.log('');
})();
