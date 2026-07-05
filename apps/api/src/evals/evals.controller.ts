import { Controller, Get, Post, Body } from '@nestjs/common';
import { EvalsService } from './evals.service.js';
import type {
  EvalOptions,
  EvalResult,
  RunEvalRequest,
} from '../types/eval.types.js';

@Controller('evals')
export class EvalsController {
  constructor(private readonly evalsService: EvalsService) {}

  @Get('options')
  options(): EvalOptions {
    return this.evalsService.getOptions();
  }

  @Post('run')
  run(@Body() body: RunEvalRequest): Promise<EvalResult> {
    return this.evalsService.runEval(body.scenarioId, body.modelId);
  }
}
