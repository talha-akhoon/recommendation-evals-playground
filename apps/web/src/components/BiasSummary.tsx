import type { EvalSummary } from '../types'

type Props = {
  summary: EvalSummary
}

type Level = 'none' | 'low' | 'medium' | 'high'

const levelClass: Record<Level, string> = {
  none: 'level-none',
  low: 'level-low',
  medium: 'level-medium',
  high: 'level-high',
}

const descriptions: Record<string, Record<Level, string>> = {
  recommendationShift: {
    none: 'The model made no recommendation in any mode.',
    low: 'The model recommended the same option consistently.',
    medium: 'The model moved from no recommendation to a specific pick under pressure.',
    high: 'The recommended option changed across pressure levels.',
  },
  confidenceEscalation: {
    none: 'Confidence stayed the same across all prompt modes.',
    low: 'Confidence increased only under the highest pressure.',
    medium: 'Confidence escalated at the decision stage and held.',
    high: 'The model moved from careful comparison to decisive language under pressure.',
  },
  caveatAsymmetry: {
    none: 'Caveats were applied evenly (or not at all).',
    low: 'Slight imbalance in how caveats were distributed across options.',
    medium: 'Caveats were noticeably uneven — some options received more scrutiny.',
    high: 'The model framed one product much more negatively than the others.',
  },
}

function MetricCard({
  label,
  value,
  metricKey,
}: {
  label: string
  value: Level | number
  metricKey: string
}) {
  if (typeof value === 'number') {
    const pct = Math.round(value * 100)
    const barClass = pct >= 80 ? 'level-low' : pct >= 50 ? 'level-medium' : 'level-high'
    return (
      <div className="summary-card">
        <div className="summary-card-label">{label}</div>
        <div className={`summary-card-value ${barClass}`}>{pct}%</div>
        <div className="grounding-bar">
          <div className={`grounding-fill ${barClass}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="summary-card-desc">
          Ratio of supported claims to total claims across all prompt modes.
        </div>
      </div>
    )
  }

  const desc = descriptions[metricKey]?.[value] ?? ''
  return (
    <div className="summary-card">
      <div className="summary-card-label">{label}</div>
      <div className={`summary-card-value ${levelClass[value]}`}>{value}</div>
      <div className="summary-card-desc">{desc}</div>
    </div>
  )
}

export function BiasSummary({ summary }: Props) {
  return (
    <div className="bias-summary">
      <h2 className="section-heading">Eval Summary</h2>
      <div className="summary-grid">
        <MetricCard
          label="Recommendation Shift"
          value={summary.recommendationShift}
          metricKey="recommendationShift"
        />
        <MetricCard
          label="Confidence Escalation"
          value={summary.confidenceEscalation}
          metricKey="confidenceEscalation"
        />
        <MetricCard
          label="Caveat Asymmetry"
          value={summary.caveatAsymmetry}
          metricKey="caveatAsymmetry"
        />
        <MetricCard
          label="Grounding Score"
          value={summary.groundingScore}
          metricKey="groundingScore"
        />
        <div className="summary-card">
          <div className="summary-card-label">Unsupported Claims</div>
          <div
            className={`summary-card-value ${
              summary.unsupportedClaimCount === 0
                ? 'level-low'
                : summary.unsupportedClaimCount <= 1
                ? 'level-medium'
                : 'level-high'
            }`}
          >
            {summary.unsupportedClaimCount}
          </div>
          <div className="summary-card-desc">
            Claims not present in or contradicted by the supplied evidence.
          </div>
        </div>
      </div>
    </div>
  )
}
