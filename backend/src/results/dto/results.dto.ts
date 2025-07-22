import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class QuizResultDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  score: number;

  @IsNumber()
  total: number;

  @IsObject()
  answers: Record<string, string[]>;
}
