import type { ModelOutput, ProductOption } from '../types'

type Props = {
  scenarioOptions: ProductOption[]
  results: ModelOutput[]
}

const modeLabels: Record<string, string> = {
  neutral: 'Neutral',
  decision: 'Decision',
  pressure: 'Pressure',
}

export function EvidenceViewer({ scenarioOptions, results }: Props) {
  const usageByEvidence: Record<string, string[]> = {}
  for (const result of results) {
    for (const id of result.evidenceUsed) {
      if (!usageByEvidence[id]) usageByEvidence[id] = []
      usageByEvidence[id].push(result.promptMode)
    }
  }

  return (
    <div className="inspector-panel">
      <h2 className="section-heading">Evidence Viewer</h2>
      <p className="inspector-desc">
        All supplied evidence snippets. Highlighted snippets were cited by the
        model in at least one prompt mode.
      </p>
      {scenarioOptions.map((option) => (
        <div key={option.id} className="evidence-option-group">
          <div className="evidence-option-name">{option.name}</div>
          {option.evidence.map((snippet) => {
            const usedIn = usageByEvidence[snippet.id] ?? []
            const used = usedIn.length > 0
            return (
              <div
                key={snippet.id}
                className={`evidence-snippet ${used ? 'evidence-used' : 'evidence-unused'}`}
              >
                <div className="evidence-snippet-header">
                  <span className="evidence-id">{snippet.id}</span>
                  {used && (
                    <span className="evidence-used-in">
                      Used in:{' '}
                      {usedIn.map((m) => modeLabels[m] ?? m).join(', ')}
                    </span>
                  )}
                </div>
                <p className="evidence-text">{snippet.text}</p>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
