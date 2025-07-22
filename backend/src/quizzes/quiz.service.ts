import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string | number;
  [key: string]: any;
}

@Injectable()
export class QuizService {
  private readonly quizBaseDir = path.join(__dirname, '../../quizz');

  async getModuleList(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.quizBaseDir);
      const directories: string[] = [];

      // Use Promise.all to wait for all directory checks
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(this.quizBaseDir, file);
          try {
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
              directories.push(file);
            }
          } catch (error) {
            console.error(`Error checking ${file}:`, error);
          }
        }),
      );

      return directories;
    } catch (error) {
      console.error('Error reading quiz directory:', error);
      return [];
    }
  }

  async getQuizFileList(module?: string): Promise<string[]> {
    try {
      const targetDir = module
        ? path.join(this.quizBaseDir, module)
        : this.quizBaseDir;

      const files = await fs.readdir(targetDir);
      return files.filter((file) => file.endsWith('.json'));
    } catch (error) {
      console.error('Error reading quiz directory:', error);
      return [];
    }
  }

  async loadQuizFile(filename: string): Promise<QuizQuestion[]> {
    try {
      // Search through all modules to find the file
      const modules = await this.getModuleList();
      for (const module of modules) {
        const filePath = path.join(this.quizBaseDir, module, filename);
        try {
          if (
            await fs
              .access(filePath)
              .then(() => true)
              .catch(() => false)
          ) {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data) as QuizQuestion[];
          }
        } catch (error) {
          continue;
        }
      }
      throw new Error(`Quiz file ${filename} not found`);
    } catch (error) {
      console.error(`Error loading quiz file ${filename}:`, error);
      throw new Error(`Failed to load quiz file: ${filename}`);
    }
  }

  async getCombinedQuiz(
    count: number,
    module?: string,
  ): Promise<QuizQuestion[]> {
    try {
      if (module) {
        // Get questions only from the specified module
        const files = await this.getQuizFileList(module);
        let allQuestions: QuizQuestion[] = [];

        for (const file of files) {
          try {
            const questions = await this.loadQuizFile(file);
            allQuestions = allQuestions.concat(questions);
          } catch (error) {
            console.error(`Error reading file ${file}:`, error);
          }
        }

        return this.shuffleArray(allQuestions).slice(0, count);
      } else {
        // Get balanced questions from all modules
        const modules = await this.getModuleList();
        const questionsPerModule = Math.ceil(count / modules.length);
        let allQuestions: QuizQuestion[] = [];

        for (const mod of modules) {
          const files = await this.getQuizFileList(mod);
          let moduleQuestions: QuizQuestion[] = [];

          for (const file of files) {
            try {
              const questions = await this.loadQuizFile(file);
              moduleQuestions = moduleQuestions.concat(questions);
            } catch (error) {
              console.error(`Error reading file ${file}:`, error);
            }
          }

          const shuffled = this.shuffleArray(moduleQuestions);
          allQuestions = allQuestions.concat(
            shuffled.slice(0, questionsPerModule),
          );
        }

        return this.shuffleArray(allQuestions).slice(0, count);
      }
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
