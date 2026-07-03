import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EvalsModule } from './evals/evals.module.js';

@Module({
  imports: [EvalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
