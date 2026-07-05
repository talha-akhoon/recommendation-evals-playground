import { useState, useEffect } from 'react'
import { fetchOptions, runEvals } from './api/evals'
import { PromptResultCard } from './components/PromptResultCard'
import { BiasSummary } from './components/BiasSummary'
import { EvidenceViewer } from './components/EvidenceViewer'
import { UnsupportedClaimsViewer } from './components/UnsupportedClaimsViewer'
import type { EvalOptions, EvalResult } from './types'

export default function App() {
  const [options, setOptions] = useState<EvalOptions | null>(null)
  const [scenarioId, setScenarioId] = useState('headphones-commuter')
  const [modelId, setModelId] = useState('mock-biased')
  const [result, setResult] = useState<EvalResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOptions()
      .then(setOptions)
      .catch(() => {
        // Fall back to defaults if API isn't up yet
        setOptions({
          scenarios: [{ id: 'headphones-commuter', name: 'Headphones for commuting' }],
          models: [
            { id: 'mock-balanced', name: 'Mock Balanced' },
            { id: 'mock-biased', name: 'Mock Biased' },
          ],
        })
      })
  }, [])

  async function handleRun() {
    setLoading(true)
    setError(null)
    try {
      const data = await runEvals(scenarioId, modelId)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-title">
            <h1>Recommendation Evals Playground</h1>
            <p className="header-subtitle">
              Test whether AI recommendations stay grounded when users move from{' '}
              <span className="mode-pill">neutral comparison</span>{' '}
              →{' '}
              <span className="mode-pill">decision request</span>{' '}
              →{' '}
              <span className="mode-pill">pressure request</span>
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="controls-section">
          <div className="controls">
            <div className="control-group">
              <label className="control-label" htmlFor="scenario-select">
                Scenario
              </label>
              <select
                id="scenario-select"
                className="control-select"
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                disabled={loading}
              >
                {(options?.scenarios ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="model-select">
                Model
              </label>
              <select
                id="model-select"
                className="control-select"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                disabled={loading}
              >
                {(options?.models ?? []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="run-button"
              onClick={handleRun}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Running…
                </>
              ) : (
                'Run all 3 prompts →'
              )}
            </button>
          </div>

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}
        </section>

        {!result && !loading && (
          <div className="empty-state">
            <div className="empty-icon">⚡</div>
            <p>Select a scenario and model, then click <strong>Run all 3 prompts</strong> to see how the model's behaviour changes under pressure.</p>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Running evaluations…</p>
          </div>
        )}

        {result && !loading && (
          <>
            <section className="results-section">
              <h2 className="section-heading">
                Prompt Results
                <span className="section-heading-meta">
                  {result.model.name} · {result.scenario.name}
                </span>
              </h2>
              <div className="results-grid">
                {result.results.map((r) => (
                  <PromptResultCard
                    key={r.promptMode}
                    result={r}
                    scenarioOptions={result.scenarioOptions}
                  />
                ))}
              </div>
            </section>

            <BiasSummary summary={result.summary} />

            <section className="inspectors-section">
              <EvidenceViewer
                scenarioOptions={result.scenarioOptions}
                results={result.results}
              />
              <UnsupportedClaimsViewer
                results={result.results}
                scenarioOptions={result.scenarioOptions}
              />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          <a
            href="https://github.com/talha-akhoon/recommendation-evals-playground"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          {' · '}
          Mock mode works without API keys · Add{' '}
          <code>OPENAI_API_KEY</code>, <code>ANTHROPIC_API_KEY</code>, or{' '}
          <code>NEBIUS_API_KEY</code> to unlock real models
        </p>
      </footer>
    </div>
  )
}
