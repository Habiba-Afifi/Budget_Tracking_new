import { Component, OnInit } from '@angular/core';
import { IncomeService } from '../income.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; // Import CommonModule for CurrencyPipe
import { MatSnackBar } from '@angular/material/snack-bar'; // Import Snackbar for notifications
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';  // Make sure this is imported
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-income-tracker',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
  imports: [FormsModule, CommonModule,ReactiveFormsModule,MatIconModule,MatInputModule,MatButtonModule,MatCardModule,MatTableModule,MatDialogModule,HttpClientModule],
})
export class IncomeTrackerComponent implements OnInit {
  incomes: any[] = [];
  incomeForm: FormGroup; // Define the FormGroup for income
  editingIncome: any = null;
  userId: string = '';
  totalIncome: number = 0;
  errorMessage: string = '';
  showConfirmDelete: boolean = false;
  incomeIdToDelete: string | null = null;

  constructor(
    private fb: FormBuilder,
    private incomeService: IncomeService,
    private snackBar: MatSnackBar
  ) {
    // Initialize the form group
    this.incomeForm = this.fb.group({
      sourceName: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.getIncomes(this.userId);
    } else {
      console.error('User ID not found in local storage.');
    }
  }

  getIncomes(userId: string): void {
    this.incomeService.getIncome(userId).subscribe(
      (data) => {
        this.incomes = data;
        this.calculateTotalIncome();
      },
      (error) => {
        console.error('Error fetching income sources', error);
      }
    );
  }

  addIncome(): void {
    this.errorMessage = ''; // Clear previous error message
    if (this.incomeForm.invalid) {
      return;
    }
  
    const newIncome = this.incomeForm.value;
    if (newIncome.amount < 0) {
      this.errorMessage = 'Amount cannot be negative.';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      return;
    }
  
    if (this.userId) {
      this.incomeService.addIncome(this.userId, newIncome.sourceName, newIncome.amount).subscribe(
        (newIncome) => {
          this.incomes.push(newIncome);
          this.calculateTotalIncome();
          this.incomeForm.reset(); 
          this.snackBar.open('Income successfully added!', 'Close', { duration: 3000 });
        },
        (error) => {
          console.error('Error adding income', error);
          this.snackBar.open('Failed to add income. Please try again.', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('User ID is missing. Please log in.', 'Close', { duration: 3000 });
    }
  }
  

  editIncome(income: any): void {
    this.editingIncome = { ...income };
  }

  updateIncome(): void {
    if (this.editingIncome) {
      this.incomeService.editIncome(this.editingIncome._id, this.editingIncome.sourceName, this.editingIncome.amount).subscribe(
        (updatedIncome) => {
          const index = this.incomes.findIndex((income) => income._id === updatedIncome._id);
          if (index !== -1) {
            this.incomes[index] = updatedIncome;
            this.calculateTotalIncome();
            this.editingIncome = null;
            this.snackBar.open('Income successfully updated!', 'Close', { duration: 3000 });
          }
        },
        (error) => {
          console.error('Error updating income', error);
          this.snackBar.open('Error updating income!', 'Close', { duration: 3000 });
        }
      );
    }
  }

  deleteIncome(incomeId: string): void {
    this.incomeIdToDelete = incomeId;
    this.showConfirmDelete = true;
  }

  confirmDelete(): void {
    if (this.incomeIdToDelete) {
      this.incomeService.deleteIncome(this.incomeIdToDelete).subscribe(
        () => {
          this.incomes = this.incomes.filter(income => income._id !== this.incomeIdToDelete);
          this.calculateTotalIncome();
          this.snackBar.open('Income successfully deleted!', 'Close', { duration: 3000 });
          this.resetDeleteState();
        },
        (error) => {
          console.error('Error deleting income', error);
          this.snackBar.open('Failed to delete income. Please try again.', 'Close', { duration: 3000 });
        }
      );
    }
  }

  resetDeleteState(): void {
    this.showConfirmDelete = false;
    this.incomeIdToDelete = null;
  }

  cancelDelete(): void {
    this.showConfirmDelete = false;
    this.incomeIdToDelete = null;
  }

  cancelEdit(): void {
    this.editingIncome = null;
  }

  calculateTotalIncome(): void {
    const incomeSum = this.incomes.reduce((total, income) => total + income.amount, 0);
    this.totalIncome = incomeSum;
    localStorage.setItem(`totalIncome_${this.userId}`, this.totalIncome.toString());
  }
}