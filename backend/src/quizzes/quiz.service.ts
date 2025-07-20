import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

// Define interfaces for better type safety
export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string | number;
  [key: string]: any;
}

@Injectable()
export class QuizService {
  private readonly quizDir = path.join(__dirname, '../../quizz');

  async getQuizFileList(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.quizDir);
      console.log(files);
      return files.filter((file: string) => file.endsWith('.json'));
    } catch (error) {
      console.error('Error reading quiz directory:', error);
      return [];
    }
  }

  async loadQuizFile(filename: string): Promise<QuizQuestion[]> {
    try {
      const filePath = path.join(this.quizDir, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as QuizQuestion[];
    } catch (error) {
      console.error(`Error loading quiz file ${filename}:`, error);
      throw new Error(`Failed to load quiz file: ${filename}`);
    }
  }

  async getCombinedQuiz(count: number): Promise<QuizQuestion[]> {
    try {
      const files = await this.getQuizFileList();
      let allQuestions: QuizQuestion[] = [];

      for (const file of files) {
        try {
          const data = await this.loadQuizFile(file);
          allQuestions = allQuestions.concat(data);
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
          // Continue with other files instead of failing completely
        }
      }

      return this.shuffleArray(allQuestions).slice(0, count);
    } catch (error) {
      console.error('Error in getCombinedQuiz:', error);
      return [];
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
