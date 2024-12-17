import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import Snackbar for notifications
import { ChangeDetectorRef } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';  // Make sure this is imported
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BudgetService } from '../budget.service'; // Import the BudgetService to get budget details
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-expense-tracker',
  templateUrl: './expense-tracker.component.html',
  styleUrls: ['./expense-tracker.component.css'],
  imports: [CommonModule,FormsModule,ReactiveFormsModule, MatIconModule, MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatDialogModule, HttpClientModule],
})
export class ExpenseTrackerComponent implements OnInit {
  expenses: any[] = [];
  newExpense = { category: '', description: '', amount: 0, date: new Date().toISOString(), isRecurring: false };
  editingExpense: any = null;
  userId: string = '';
  totalExpenses: number = 0;
  amountError: boolean = false; // Error flag for invalid amount
  categoryLimits: { [key: string]: number } = {}; // Store category limits
  amountExceedLimitError: boolean = false; // Error flag for amount exceeding limit
  errorMessage: string = ''; // Error message for amount exceeding limit
  successMessage: string = ''; // New property to hold the success message
  showConfirmDelete: boolean = false; // Controls the visibility of the confirmation box
  expenseIdToDelete: string | null = null; 
  expenseForm: FormGroup; // FormGroup for managing expenses

  constructor(
    private expenseService: ExpenseService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private budgetService: BudgetService // Inject the BudgetService
  ) {
    // Initialize the form group
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      description: [''],
      amount: [0, [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString(), Validators.required],
      isRecurring: [false]
    });
  }

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
  
    if (storedUserId) {
      this.userId = storedUserId;

      // Fetch the budget to get the category limits
      this.budgetService.getBudget(this.userId).subscribe(
        (budgetData) => {
          if (budgetData && budgetData.categories) {
            // Set category limits from the budget data
            budgetData.categories.forEach((category: any) => {
              this.categoryLimits[category.categoryName] = category.categoryLimit;
            });
          }
        },
        (error) => {
          console.error('Error fetching budget data:', error);
        }
      );

      this.getExpenses(this.userId);
    } else {
      console.error('User ID not found in local storage.');
    }
  }

  getExpenses(userId: string): void {
    this.expenseService.getExpenses(userId).subscribe(
      (expenses) => {
        this.expenses = expenses;
        this.calculateTotalExpenses();
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  addExpense(): void {
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;

      if (this.categoryLimits[expenseData.category] && expenseData.amount > this.categoryLimits[expenseData.category]) {
        this.amountExceedLimitError = true;
        this.errorMessage = `AMOUNT EXCEEDS LIMIT for ${expenseData.category}`;
        return;
      }

      this.amountError = false;
      this.amountExceedLimitError = false;

      this.expenseService.addExpense(this.userId, expenseData.category, expenseData.description, expenseData.amount, expenseData.date, expenseData.isRecurring).subscribe(
        (expense) => {
          this.expenses.push(expense);
          this.calculateTotalExpenses();
          this.expenseForm.reset({ category: '', description: '', amount: 0, date: new Date().toISOString(), isRecurring: false });
        },
        (error) => {
          console.error('Error adding expense:', error);
        }
      );
    } else {
      console.error('Form is invalid.');
    }
  }

  editExpenseItem(expense: any): void {
    this.editingExpense = { ...expense }; // Deep copy to avoid modifying original expense
  }

  updateExpense(): void {
    if (this.editingExpense) {
      const { _id, category, description, amount, date, isRecurring } = this.editingExpense;
      if (!category || !description || amount <= 0) {
        console.error('Invalid data for updating expense');
        return;
      }

      this.expenseService.editExpense(_id, category, description, amount, date, isRecurring).subscribe(
        (updatedExpense) => {
          const index = this.expenses.findIndex((expense) => expense._id === updatedExpense._id);
          if (index !== -1) {
            this.expenses[index] = updatedExpense;
            this.editingExpense = null;
            this.calculateTotalExpenses();
          }
        },
        (error) => {
          console.error('Error updating expense:', error);
        }
      );
    }
  }

  cancelEdit(): void {
    this.editingExpense = null;
  }

  deleteExpense(expenseId: string): void {
    this.expenseIdToDelete = expenseId; // Store the ID of the expense to delete
    this.showConfirmDelete = true; // Show the confirmation modal
  }
  
  confirmDelete(): void {
    if (this.expenseIdToDelete) {
      // Call the delete API for expenses
      this.expenseService.deleteExpense(this.expenseIdToDelete).subscribe(
        () => {
          // Remove the deleted expense from the local expenses array
          this.expenses = this.expenses.filter(expense => expense._id !== this.expenseIdToDelete);
          
          // Recalculate the total expenses after deletion
          this.calculateTotalExpenses();
          
          // Show success message
          this.snackBar.open('Expense successfully deleted!', 'Close', { duration: 3000 });
          
          // Clear the deletion state
          this.resetDeleteState();
        },
        (error) => {
          console.error('Error deleting expense', error);
          this.snackBar.open('Failed to delete expense. Please try again.', 'Close', { duration: 3000 });
        }
      );
    }
  }
  
  resetDeleteState(): void {
    this.showConfirmDelete = false; // Hide the confirmation modal
    this.expenseIdToDelete = null; // Clear the ID of the expense to delete
  }
  
  cancelDelete(): void {
    this.showConfirmDelete = false; // Hide the confirmation modal without deleting
    this.expenseIdToDelete = null; // Clear the ID of the expense to delete
  }
  
  calculateTotalExpenses(): void {
    const recurringExpenses = this.getRecurringExpensesTotal();
    const nonRecurringExpenses = this.getNonRecurringExpensesTotal();

    this.totalExpenses = recurringExpenses + nonRecurringExpenses;

    // Store total expenses, recurring expenses, and non-recurring expenses with userId in localStorage
    localStorage.setItem(`totalExpenses_${this.userId}`, this.totalExpenses.toString());
  }

  getRecurringExpensesTotal(): number {
    return this.expenses
      .filter((expense) => expense.isRecurring)
      .reduce((total, expense) => total + expense.amount, 0);
  }

  getNonRecurringExpensesTotal(): number {
    return this.expenses
      .filter((expense) => !expense.isRecurring)
      .reduce((total, expense) => total + expense.amount, 0);
  }
}