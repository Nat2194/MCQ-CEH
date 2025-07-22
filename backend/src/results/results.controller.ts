import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResultsService } from './results.service';
import { QuizResultDto } from './dto/results.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  saveResult(@Body() data: QuizResultDto) {
    return this.resultsService.saveResult(data);
  }

  @Get()
  getResults() {
    return this.resultsService.getAllResults();
  }
}
