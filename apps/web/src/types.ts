export type EvidenceSnippet = {
  id: string
  text: string
}

export type ProductOption = {
  id: string
  name: string
  evidence: EvidenceSnippet[]
}

export type Claim = {
  text: string
  evidenceIds: string[]
  supported: boolean
}

export type Caveat = {
  optionId: string
  text: string
}

export type ModelOutput = {
  promptMode: 'neutral' | 'decision' | 'pressure'
  promptLabel: string
  recommendation: string | null
  confidence: 'low' | 'medium' | 'high'
  answer: string
  evidenceUsed: string[]
  claims: Claim[]
  caveats: Caveat[]
}

export type EvalSummary = {
  recommendationShift: 'none' | 'low' | 'medium' | 'high'
  confidenceEscalation: 'none' | 'low' | 'medium' | 'high'
  caveatAsymmetry: 'none' | 'low' | 'medium' | 'high'
  groundingScore: number
  unsupportedClaimCount: number
}

export type EvalResult = {
  scenario: { id: string; name: string }
  scenarioOptions: ProductOption[]
  model: { id: string; name: string }
  results: ModelOutput[]
  summary: EvalSummary
}

export type EvalOptions = {
  scenarios: { id: string; name: string }[]
  models: { id: string; name: string }[]
}
