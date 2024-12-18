import { Component, OnInit } from '@angular/core';
import { IncomeService } from '../income.service';
import { ExpenseService } from '../expense.service';
import { GoalService } from '../goal.service';
import { BudgetService } from '../budget.service'; // Import BudgetService to get the budget data
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ReportingComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  budgetVarianceIncome: number = 0;  // Budget variance for income
  budgetVarianceExpense: number = 0; // Budget variance for expenses
  savingsProgress: number = 0;
  incomeData: any[] = [];
  expenseData: any[] = [];
  goals: any[] = [];
  userId: string = '';
  reportStartDate: string = '';
  reportEndDate: string = '';
  budgetData: any = {}; // Store the budget data (income and expenses)

  largestIncomeSource: string = ''; // Source with largest income
  largestIncomeAmount: number = 0; // Amount of the largest income source
  largestExpenseCategory: string = ''; // Category with largest expense
  largestExpenseAmount: number = 0; // Amount of the largest expense category
  
  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private goalService: GoalService,
    private budgetService: BudgetService // Inject BudgetService
  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.getIncomeData();
      this.getExpenseData();
      this.getGoalData(); // Fetch goals to load their details
      this.getBudgetData(); // Fetch budget data to calculate variance
    } else {
      console.error('User ID not found in local storage.');
    }
  }

  // Get Income Data
  getIncomeData(): void {
    this.incomeService.getIncome(this.userId).subscribe(
      (data) => {
        this.incomeData = data;
        this.calculateTotalIncome();
        this.findLargestIncomeSource();
      },
      (error) => {
        console.error('Error fetching income data:', error);
      }
    );
  }

  // Get Expense Data
  getExpenseData(): void {
    this.expenseService.getExpenses(this.userId).subscribe(
      (data) => {
        this.expenseData = data;
        this.calculateTotalExpenses();
        this.findLargestExpenseCategory();
      },
      (error) => {
        console.error('Error fetching expense data:', error);
      }
    );
  }

  // Get Goal Data (for savings progress)
  getGoalData(): void {
    this.goalService.getGoalsByUser(this.userId).subscribe(
      (data) => {
        this.goals = data;
        this.calculateGoalProgress();
      },
      (error) => console.error('Error fetching goal data:', error)
    );
  }

  // Get Budget Data (for budget variance calculation)
  getBudgetData(): void {
    this.budgetService.getBudget(this.userId).subscribe(
      (data) => {
        this.budgetData = data;
        this.calculateBudgetVarianceIncome(); // Calculate Budget Variance for Income
        this.calculateBudgetVarianceExpense(); // Calculate Budget Variance for Expenses
      },
      (error) => {
        console.error('Error fetching budget data:', error);
      }
    );
  }

  // Calculate Total Income
  calculateTotalIncome(): void {
    this.totalIncome = this.incomeData.reduce((total, income) => total + income.amount, 0);
  }

  // Calculate Total Expenses
  calculateTotalExpenses(): void {
    this.totalExpenses = this.expenseData.reduce((total, expense) => total + expense.amount, 0);
  }

  // Calculate Budget Variance for Income
  calculateBudgetVarianceIncome(): void {
    const incomeBudget = this.budgetData.income || 0; // Budgeted income
    this.budgetVarianceIncome = this.totalIncome - incomeBudget; // Actual income - Budgeted income
  }

  // Calculate Budget Variance for Expenses
  calculateBudgetVarianceExpense(): void {
    const expenseBudget = this.budgetData.expenses || 0; // Budgeted expenses
    this.budgetVarianceExpense = this.totalExpenses - expenseBudget; // Actual expenses - Budgeted expenses
  }

  calculateGoalProgress(): void {
    const totalProgress = this.goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
    const goalCount = this.goals.length || 1; // Avoid division by zero
    this.savingsProgress = totalProgress / goalCount; // Average progress
  }

  // Find the income source with the largest amount
  findLargestIncomeSource(): void {
    if (this.incomeData.length > 0) {
      let maxIncome = this.incomeData[0];
      this.incomeData.forEach((income) => {
        if (income.amount > maxIncome.amount) {
          maxIncome = income;
        }
      });
      this.largestIncomeSource = maxIncome.sourceName;
      this.largestIncomeAmount = maxIncome.amount;
    }
  }

  // Find the expense category with the largest amount
  findLargestExpenseCategory(): void {
    if (this.expenseData.length > 0) {
      let maxExpense = this.expenseData[0];
      this.expenseData.forEach((expense) => {
        if (expense.amount > maxExpense.amount) {
          maxExpense = expense;
        }
      });
      this.largestExpenseCategory = maxExpense.category;
      this.largestExpenseAmount = maxExpense.amount;
    }
  }
}
