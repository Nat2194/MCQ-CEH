
import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class ResultsService {
  private readonly resultFile = path.join(__dirname, '../../results.json');

  saveResult(data: any) {
    const results = this.getAllResults();
    results.push({ ...data, date: new Date().toISOString() });
    fs.writeJsonSync(this.resultFile, results);
    return { status: 'saved' };
  }

  getAllResults() {
    if (!fs.existsSync(this.resultFile)) {
      return [];
    }
    return fs.readJsonSync(this.resultFile);
  }
}
