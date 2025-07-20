import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('list')
  async getAllQuizFiles(): Promise<string[]> {
    console.log('get all json');
    return await this.quizService.getQuizFileList();
  }

  @Get('load/:filename')
  async loadQuiz(@Param('filename') filename: string) {
    if (!filename || !filename.endsWith('.json')) {
      throw new BadRequestException('Invalid filename. Must be a .json file');
    }
    return await this.quizService.loadQuizFile(filename);
  }

  @Get('combined')
  async getCombinedQuiz(@Query('count') count: string) {
    const parsedCount = parseInt(count);

    if (isNaN(parsedCount) || parsedCount <= 0) {
      throw new BadRequestException('Count must be a positive number');
    }

    if (parsedCount > 1000) {
      throw new BadRequestException('Count cannot exceed 1000');
    }

    return await this.quizService.getCombinedQuiz(parsedCount);
  }
}
