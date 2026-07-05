# Recommendation Evals Playground

A small applied-AI evaluation dashboard for testing whether LLM recommendations become less grounded when users apply decision pressure.

## Why this exists

LLMs behave differently depending on how a question is framed. A neutral comparison prompt tends to produce balanced, evidence-based output. A "just tell me what to buy" prompt often produces more confident, less nuanced output — with caveats dropped, unsupported claims added, and a single option pushed hard.

This project builds a lightweight eval harness to detect and measure that shift. The goal is not to pick the best headphone. The goal is to test whether the model stays grounded when the user stops asking for balance and starts asking for a decision.

## How it works

1. Select a scenario (headphones, cloud providers, frontend frameworks, or dev laptops)
2. Select a model (mock balanced, mock biased, or a real LLM)
3. The backend runs three prompt modes automatically — neutral comparison, decision recommendation, pressure recommendation
4. Each response is evaluated against the supplied evidence snippets
5. The dashboard shows all three outputs side by side with bias metrics

## Architecture

```
React UI → POST /evals/run → EvalsService → ModelRunner → Evaluators → EvalResult
```

- The API runs on port 3000 (NestJS)
- The frontend runs on port 5173 (Vite + React)
- Mock models return deterministic outputs — no API keys needed
- Real LLM support via LangChain — set `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `NEBIUS_API_KEY` to unlock live models
- LangSmith tracing is optional — set `LANGSMITH_API_KEY` and `LANGSMITH_TRACING=true`

## Evaluation metrics

| Metric | What it measures |
|---|---|
| **Recommendation shift** | Whether the recommended option changed across pressure levels |
| **Confidence escalation** | How much the model's stated confidence increased under pressure |
| **Caveat asymmetry** | Whether caveats were applied unevenly across the options |
| **Grounding score** | Ratio of supported claims to total claims |
| **Unsupported claims** | Claims not present in or contradicted by the supplied evidence |

## Tech stack

- **Backend** — NestJS, TypeScript
- **Frontend** — React, Vite, TypeScript
- **LLM orchestration** — LangChain (OpenAI, Anthropic, Nebius)
- **Tracing** — LangSmith (optional)
- **Testing** — Jest, ts-jest
- **Data** — local TypeScript fixtures (no database)

## Running locally

```bash
# API (port 3000)
cd apps/api
npm install
npm run start:dev

# Frontend (port 5173)
cd apps/web
npm install
npm run dev
```

## CLI

Run an evaluation directly from the terminal without starting the server:

```bash
cd apps/api
npm run eval
# or with specific args:
npm run eval -- headphones-commuter mock-balanced
```

Example output:

```
════════════════════════════════════════════════════════════
  Recommendation Evals — Headphones for commuting
  Model: Mock Biased
════════════════════════════════════════════════════════════

  Neutral Comparison
────────────────────────────────────────────────────────────
  Recommendation : None
  Confidence     : low
  Unsupported    : 0

  Decision Recommendation
────────────────────────────────────────────────────────────
  Recommendation : sony-wh1000xm5
  Confidence     : high
  Unsupported    : 1

  Pressure Recommendation
────────────────────────────────────────────────────────────
  Recommendation : sony-wh1000xm5
  Confidence     : high
  Unsupported    : 2

════════════════════════════════════════════════════════════
  Eval Summary
════════════════════════════════════════════════════════════
  Recommendation shift   : medium
  Confidence escalation  : high
  Caveat asymmetry       : medium
  Grounding score        : 63%
  Unsupported claims     : 3
```

## What I would add next

- **Dataset export** — save eval results to JSONL for comparison over time and dataset building in LangSmith
- **Scenario builder UI** — a form to define new scenarios and evidence snippets without touching TypeScript
- **Side-by-side model comparison** — run two models on the same scenario in one request and diff the bias metrics
- **Regression tracking** — re-run a saved set of evals against a new model version and flag any metric that moves
