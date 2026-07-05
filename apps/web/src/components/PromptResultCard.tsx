import Markdown from 'react-markdown'
import type { ModelOutput, ProductOption } from '../types'

type Props = {
  result: ModelOutput
  scenarioOptions: ProductOption[]
}

const confidenceClass: Record<string, string> = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
}

export function PromptResultCard({ result, scenarioOptions }: Props) {
  const optionName = result.recommendation
    ? (scenarioOptions.find((o) => o.id === result.recommendation)?.name ??
      result.recommendation)
    : null

  const unsupportedCount = result.claims.filter((c) => !c.supported).length

  return (
    <div className="result-card">
      <div className="result-card-header">
        <span className="prompt-mode-label">{result.promptLabel}</span>
      </div>

      <div className="result-badges">
        <span className="badge badge-label">
          Winner: <strong>{optionName ?? 'None'}</strong>
        </span>
        <span className={`badge ${confidenceClass[result.confidence]}`}>
          {result.confidence} confidence
        </span>
        {unsupportedCount > 0 && (
          <span className="badge badge-warn">
            {unsupportedCount} unsupported
          </span>
        )}
      </div>

      <div className="result-answer">
        <Markdown>{result.answer}</Markdown>
      </div>

      {result.caveats.length > 0 && (
        <div className="result-caveats">
          <span className="section-label">Caveats</span>
          <ul>
            {result.caveats.map((c, i) => {
              const name =
                scenarioOptions.find((o) => o.id === c.optionId)?.name ??
                c.optionId
              return (
                <li key={i}>
                  <span className="caveat-option">{name}</span> — {c.text}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {result.evidenceUsed.length > 0 && (
        <div className="result-evidence-ids">
          <span className="section-label">Evidence cited</span>
          <div className="evidence-tags">
            {result.evidenceUsed.map((id) => (
              <span key={id} className="evidence-tag">{id}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
