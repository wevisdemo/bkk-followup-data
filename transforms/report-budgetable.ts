import { ReportBudget } from '../models/base-report.ts';
import { ProblemType } from '../models/problem-type.ts';

export abstract class ReportBudgetable {
  abstract getProblemBudgets(problem: ProblemType | 'all'): { [key:number]: number };

  getOverallReportBudget(focusedProblem: ProblemType): ReportBudget {
    const focused = this.getProblemBudgets(focusedProblem);
    const all = this.getProblemBudgets('all');

    let overallFocused = 0;
    let overallAll = 0;
    for (const year in focused) {
      overallAll += all[year];
      overallFocused += focused[year];
    }
  
    return { all: overallAll, focused: overallFocused };
  }

  getReportBudgets(focusedProblem: ProblemType): {[key: number]: ReportBudget} {
    const focused = this.getProblemBudgets(focusedProblem);
    const all = this.getProblemBudgets('all');

    const budgetPerYear: {[key: number]: ReportBudget} = {};
    for (const year in focused) {
      budgetPerYear[year] = { 
        all: all[year],
        focused: focused[year],
      }
    }
  
    return budgetPerYear;
  }
}