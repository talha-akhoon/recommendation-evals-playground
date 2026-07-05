import type { EvalOptions, EvalResult } from '../types'

export async function fetchOptions(): Promise<EvalOptions> {
  const res = await fetch('/api/evals/options')
  if (!res.ok) throw new Error('Failed to load options')
  return res.json()
}

export async function runEvals(
  scenarioId: string,
  modelId: string,
): Promise<EvalResult> {
  const res = await fetch('/api/evals/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenarioId, modelId }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? 'Eval failed')
  }
  return res.json()
}
