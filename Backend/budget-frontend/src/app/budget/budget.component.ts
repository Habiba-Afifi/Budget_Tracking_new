import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { BudgetService } from '../budget.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms';  // Make sure this is imported

@Component({
  selector: 'app-budget-create',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  imports: [MatIconModule, MatButtonModule, MatInputModule,CommonModule,FormsModule,ReactiveFormsModule],
})
export class BudgetComponent implements OnInit {
  budgetForm: FormGroup;
  validationError: string | null = null;
  budgetSummary: any = null;

  // Predefined categories
  predefinedCategories = [
    'Insurance',
    'Rent',
    'Food Expenses',
    'Dues and Subscriptions',
    'Maintenance and Repairs',
    'Utilities',
  ];

  // Months list
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private router: Router
  ) {
    this.budgetForm = this.fb.group(
      {
        userID: ['', Validators.required],
        month: ['', Validators.required],
        income: ['', [Validators.required, Validators.min(1), this.negativeValueValidator]],
        expenses: ['', [Validators.required, Validators.min(0), this.negativeValueValidator]],
        categories: this.fb.array([]), // Initialize form array for categories
      },
      { validators: this.expensesNotExceedIncome } // Add custom validator
    );
  }

  ngOnInit(): void {
    // Get user ID from a secure source, not from localStorage (you can get this from your authentication system)
    const storedUserID = localStorage.getItem('userId');
    if (storedUserID) {
      this.budgetForm.patchValue({ userID: storedUserID });
    }
  }

  // Getter for categories form array
  get categories(): FormArray {
    return this.budgetForm.get('categories') as FormArray;
  }

  // Add a new category group to the form array
  addCategory(): void {
    const categoryGroup = this.fb.group({
      categoryName: ['', Validators.required],
      categoryLimit: ['', [Validators.required, Validators.min(1), this.negativeValueValidator]],
    });
    this.categories.push(categoryGroup);
  }

  // Remove a category group from the form array
  removeCategory(index: number): void {
    this.categories.removeAt(index);
  }

  // Custom validator for negative values
  negativeValueValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value < 0) {
      return { negativeValue: true };
    }
    return null;
  }

  // Custom validation for expenses not exceeding income
  expensesNotExceedIncome(control: AbstractControl): ValidationErrors | null {
    const income = control.get('income')?.value;
    const expenses = control.get('expenses')?.value;

    if (income !== null && expenses !== null && expenses > income) {
      return { expensesExceedIncome: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      this.validationError = null; // Reset validation error
      const budgetData = this.budgetForm.value;
  
      this.budgetService.createBudget(budgetData).subscribe(
        (response) => {
          this.budgetSummary = {
            income: response.income,
            expenses: response.expenses,
            categories: response.categories || []
          };
        },
        (error) => {
          console.error('Error creating budget:', error);
          this.validationError = 'Error creating budget! Please try again.';
        }
      );
    } else {
      this.validationError = this.budgetForm.hasError('expensesExceedIncome')
        ? 'Expenses exceed income!'
        : 'Please fill out the form correctly.';
    }
  }
}