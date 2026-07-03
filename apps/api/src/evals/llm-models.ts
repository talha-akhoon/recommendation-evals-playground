import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { z } from 'zod';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { ModelOutput, PromptMode, Scenario } from '../types/eval.types.js';
import type { ModelRunner } from './model-runner.js';

// ---------------------------------------------------------------------------
// Zod schema for structured LLM output
// The supported field is omitted here — the judge fills it in afterwards.
// ---------------------------------------------------------------------------

const ClaimSchema = z.object({
  text: z.string().describe('A specific factual claim made in the answer.'),
  evidenceIds: z
    .array(z.string())
    .describe('IDs of evidence snippets that support this claim.'),
});

const CaveatSchema = z.object({
  optionId: z.string().describe('The option ID this caveat applies to.'),
  text: z.string().describe('The caveat or limitation.'),
});

const LLMOutputSchema = z.object({
  recommendation: z
    .string()
    .nullable()
    .describe(
      'The option ID to recommend, or null if no recommendation is made. Must be one of the supplied option IDs.',
    ),
  confidence: z
    .enum(['low', 'medium', 'high'])
    .describe('How confident this response is.'),
  answer: z.string().describe('Your full prose response to the user.'),
  evidenceUsed: z
    .array(z.string())
    .describe('IDs of all evidence snippets referenced in the answer.'),
  claims: z.array(ClaimSchema).describe('Factual claims made in the answer.'),
  caveats: z
    .array(CaveatSchema)
    .describe('Product-specific caveats or limitations mentioned.'),
});

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildSystemPrompt(scenario: Scenario): string {
  const optionBlock = scenario.options
    .map((opt) => {
      const evidenceBlock = opt.evidence
        .map((e) => `  [${e.id}] ${e.text}`)
        .join('\n');
      return `### ${opt.name} (id: ${opt.id})\n${evidenceBlock}`;
    })
    .join('\n\n');

  const allEvidenceIds = scenario.options
    .flatMap((o) => o.evidence.map((e) => e.id))
    .join(', ');

  const allOptionIds = scenario.options.map((o) => o.id).join(', ');

  return [
    `You are an AI assistant helping a user choose between products for: ${scenario.name}.`,
    `${scenario.description}`,
    '',
    'IMPORTANT: Only use the supplied evidence below. Do not draw on external knowledge.',
    '',
    '## Products and evidence',
    '',
    optionBlock,
    '',
    `Valid option IDs: ${allOptionIds}`,
    `Valid evidence IDs: ${allEvidenceIds}`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Base class shared by both providers
// ---------------------------------------------------------------------------

abstract class BaseLLMModel implements ModelRunner {
  abstract id: string;
  abstract name: string;
  protected abstract buildLLM(): BaseChatModel;

  async run(scenario: Scenario, promptMode: PromptMode): Promise<ModelOutput> {
    const llm = this.buildLLM();
    const structured = llm.withStructuredOutput(LLMOutputSchema);

    const raw = await structured.invoke([
      { role: 'system', content: buildSystemPrompt(scenario) },
      { role: 'user', content: promptMode.prompt },
    ]);

    // Validate that option IDs in the output exist in the scenario
    const validOptionIds = new Set(scenario.options.map((o) => o.id));
    const validEvidenceIds = new Set(
      scenario.options.flatMap((o) => o.evidence.map((e) => e.id)),
    );

    const recommendation =
      raw.recommendation && validOptionIds.has(raw.recommendation)
        ? raw.recommendation
        : null;

    const evidenceUsed = raw.evidenceUsed.filter((id) =>
      validEvidenceIds.has(id),
    );

    return {
      promptMode: promptMode.id,
      promptLabel: promptMode.label,
      recommendation,
      confidence: raw.confidence,
      answer: raw.answer,
      evidenceUsed,
      // supported defaults to true — llm-judge.ts updates this afterwards
      claims: raw.claims.map((c) => ({
        ...c,
        evidenceIds: c.evidenceIds.filter((id) => validEvidenceIds.has(id)),
        supported: true,
      })),
      caveats: raw.caveats.filter((c) => validOptionIds.has(c.optionId)),
    };
  }
}

// ---------------------------------------------------------------------------
// OpenAI
// ---------------------------------------------------------------------------

export class OpenAIModel extends BaseLLMModel {
  id = 'openai-gpt4o';
  name = 'OpenAI GPT-4o';

  protected buildLLM(): BaseChatModel {
    return new ChatOpenAI({ model: 'gpt-4o', temperature: 0.2 });
  }
}

// ---------------------------------------------------------------------------
// Anthropic
// ---------------------------------------------------------------------------

export class AnthropicModel extends BaseLLMModel {
  id = 'anthropic-claude';
  name = 'Anthropic Claude 3.5 Sonnet';

  protected buildLLM(): BaseChatModel {
    return new ChatAnthropic({
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.2,
    });
  }
}

// ---------------------------------------------------------------------------
// Nebius AI Studio (OpenAI-compatible endpoint)
// Uses NEBIUS_API_KEY + NEBIUS_MODEL (defaults to Llama 3.1 70B).
// Set NEBIUS_BASE_URL to override the endpoint (defaults to Nebius Studio).
// ---------------------------------------------------------------------------

export class NebiusModel extends BaseLLMModel {
  id = 'nebius';
  name: string;

  constructor() {
    super();
    const model =
      process.env.NEBIUS_MODEL ?? 'meta-llama/Meta-Llama-3.1-70B-Instruct';
    this.name = `Nebius (${model})`;
  }

  protected buildLLM(): BaseChatModel {
    return new ChatOpenAI({
      apiKey: process.env.NEBIUS_API_KEY,
      model: process.env.NEBIUS_MODEL ?? 'meta-llama/Meta-Llama-3.1-70B-Instruct',
      temperature: 0.2,
      configuration: {
        baseURL:
          process.env.NEBIUS_BASE_URL ?? 'https://api.studio.nebius.ai/v1/',
      },
    });
  }
}
