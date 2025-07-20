import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { QuizModule } from './quizzes/quiz.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [QuizModule, ResultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
