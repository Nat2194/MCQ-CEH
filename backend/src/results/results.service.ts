// results.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { QuizResult } from './dto/results.interface';

@Injectable()
export class ResultsService {
  private readonly resultFile = path.join(__dirname, '../../results.json');

  async saveResult(
    data: QuizResult,
  ): Promise<{ status: string; data?: QuizResult }> {
    try {
      const results = await this.getAllResults();
      results.push({ ...data, date: new Date().toISOString() });
      await fs.writeJson(this.resultFile, results);
      return { status: 'success', data };
    } catch (error) {
      throw new InternalServerErrorException(
        `{Failed to save results : ${error}`,
      );
    }
  }

  async getAllResults(): Promise<QuizResult[]> {
    if (!fs.existsSync(this.resultFile)) {
      return [];
    }
    return (await fs.readJson(this.resultFile)) as QuizResult[];
  }
}
