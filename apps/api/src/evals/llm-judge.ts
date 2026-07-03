import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { z } from 'zod';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { Claim, EvidenceSnippet } from '../types/eval.types.js';

const JudgeSchema = z.object({
  supported: z
    .boolean()
    .describe(
      'True if the claim is supported by or consistent with the evidence. False if it is unsupported, contradicted, or significantly overstated.',
    ),
  reason: z
    .string()
    .describe('One sentence explaining why the claim is or is not supported.'),
});

function buildJudgeLLM(): BaseChatModel | null {
  if (process.env.OPENAI_API_KEY) {
    return new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 });
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return new ChatAnthropic({
      model: 'claude-3-haiku-20240307',
      temperature: 0,
    });
  }
  return null;
}

async function judgeOneClaim(
  claim: string,
  allEvidence: EvidenceSnippet[],
  llm: BaseChatModel,
): Promise<boolean> {
  const evidenceText = allEvidence
    .map((e) => `[${e.id}]: ${e.text}`)
    .join('\n');

  const structured = llm.withStructuredOutput(JudgeSchema);

  const result = await structured.invoke([
    {
      role: 'system',
      content:
        'You are an evidence grounding judge. You assess whether a claim is supported by supplied evidence. Do not use external knowledge — only what is in the evidence.',
    },
    {
      role: 'user',
      content: `Evidence:\n${evidenceText}\n\nClaim: "${claim}"\n\nIs this claim supported by the evidence?`,
    },
  ]);

  return result.supported;
}

export async function judgeClaimsWithLLM(
  claims: Claim[],
  allEvidence: EvidenceSnippet[],
): Promise<Claim[]> {
  const llm = buildJudgeLLM();
  if (!llm || claims.length === 0) return claims;

  const results = await Promise.all(
    claims.map(async (claim) => ({
      ...claim,
      supported: await judgeOneClaim(claim.text, allEvidence, llm),
    })),
  );

  return results;
}
