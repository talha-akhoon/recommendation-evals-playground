import type { ModelOutput, ProductOption } from '../types'

type Props = {
  results: ModelOutput[]
  scenarioOptions: ProductOption[]
}

export function UnsupportedClaimsViewer({ results, scenarioOptions }: Props) {
  const allEvidence = scenarioOptions.flatMap((o) => o.evidence)

  const unsupported = results.flatMap((r) =>
    r.claims
      .filter((c) => !c.supported)
      .map((c) => ({
        promptMode: r.promptMode,
        promptLabel: r.promptLabel,
        claim: c,
      })),
  )

  if (unsupported.length === 0) {
    return (
      <div className="inspector-panel">
        <h2 className="section-heading">Unsupported Claims</h2>
        <p className="inspector-desc no-issues">
          No unsupported claims detected across any prompt mode.
        </p>
      </div>
    )
  }

  return (
    <div className="inspector-panel">
      <h2 className="section-heading">Unsupported Claims</h2>
      <p className="inspector-desc">
        Claims that are not present in or are contradicted by the supplied
        evidence.
      </p>
      <div className="unsupported-list">
        {unsupported.map((item, i) => {
          const relatedEvidence =
            item.claim.evidenceIds.length > 0
              ? item.claim.evidenceIds.flatMap(
                  (id) => allEvidence.filter((e) => e.id === id),
                )
              : []

          return (
            <div key={i} className="unsupported-item">
              <div className="unsupported-header">
                <span className="badge badge-warn">{item.promptLabel}</span>
              </div>
              <p className="unsupported-claim">
                &ldquo;{item.claim.text}&rdquo;
              </p>
              {relatedEvidence.length > 0 ? (
                <div className="unsupported-evidence">
                  <span className="section-label">Related evidence</span>
                  {relatedEvidence.map((e) => (
                    <div key={e.id} className="unsupported-evidence-snippet">
                      <span className="evidence-id">{e.id}</span>
                      <p>{e.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="unsupported-no-evidence">
                  No supporting evidence was cited — claim appears unsupported.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
