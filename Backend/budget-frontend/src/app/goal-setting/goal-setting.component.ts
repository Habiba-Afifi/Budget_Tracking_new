import { Component, OnInit } from '@angular/core';
import { GoalService } from '../goal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-goal-setting',
  templateUrl: './goal-setting.component.html',
  styleUrls: ['./goal-setting.component.css'],
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  
})
export class GoalSettingComponent implements OnInit {
  goals: any[] = [];
  goalForm: FormGroup; // FormGroup for the goal form
  errorMessage: string = '';
  userId: string = '';

  constructor(private goalService: GoalService, private router: Router, private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      targetAmount: [0, [Validators.required, Validators.min(1)]],
      savedAmount: [0, Validators.required],
      deadline: ['', Validators.required],
      progress: [0]
    });
  }

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.loadGoals();
      this.loadSavedAmount(); 
    } else {
      console.error('User ID not found in local storage.');
    }
  }

  loadSavedAmount(): void {
    const savedAmountFromStorage = localStorage.getItem(`savedAmount_${this.userId}`);
    if (savedAmountFromStorage) {
      this.goalForm.patchValue({ savedAmount: parseFloat(savedAmountFromStorage) }); // Load the saved amount from local storage
    } else {
      const totalIncome = parseFloat(localStorage.getItem(`totalIncome_${this.userId}`) || '0');
      const totalExpenses = parseFloat(localStorage.getItem(`totalExpenses_${this.userId}`) || '0');
      this.goalForm.patchValue({ savedAmount: totalIncome - totalExpenses });
    }
  }

  setSavedAmount(): void {
    const totalIncome = parseFloat(localStorage.getItem(`totalIncome_${this.userId}`) || '0');
    const totalExpenses = parseFloat(localStorage.getItem(`totalExpenses_${this.userId}`) || '0');
    const savedAmount = totalIncome - totalExpenses;

    this.goalForm.patchValue({ savedAmount });
    localStorage.setItem(`savedAmount_${this.userId}`, savedAmount.toString());
  }

  loadGoals(): void {
    if (this.userId) {
      this.goalService.getGoalsByUser(this.userId).subscribe(
        (data) => {
          this.goals = data;
          this.calculateAndStoreProgress();
        },
        (error) => {
          console.error('Error fetching goals', error);
        }
      );
    }
  }
  createGoal(): void {
    this.errorMessage = ''; // Clear previous error message
  
    if (this.userId) {
      const goalData = this.goalForm.value;
  
      // Check if Saved Amount is 0 or less
      if (goalData.savedAmount <= 0) {
        this.errorMessage = 'Cannot create a goal. Your Saved Amount is zero.';
        return;
      }
  
      // Check if Target Amount is invalid or less than 1
      if (goalData.targetAmount <= 0) {
        this.errorMessage = 'Invalid target amount. It must be greater than zero.';
        return;
      }
  
      // Calculate progress even if Target Amount exceeds Saved Amount
      if (goalData.targetAmount > goalData.savedAmount) {
        alert('Target exceeds saved amount. Goal will still be created.');
        goalData.progress = Math.min((goalData.savedAmount / goalData.targetAmount) * 100, 100);
      } else {
        goalData.progress = Math.min((goalData.savedAmount / goalData.targetAmount) * 100, 100);
      }
  
      // Create the goal without updating saved amount if Target > Saved
      this.goalService.createGoal(this.userId, goalData).subscribe(
        (goal) => {
          this.goals.push(goal);
          if (goalData.targetAmount <= goalData.savedAmount) {
            this.updateSavedAmount(goalData.targetAmount); // Update saved amount only when valid
          }
          this.calculateAndStoreProgress();
          this.resetGoalForm();
        },
        (error) => {
          console.error('Error creating goal', error);
          alert('Error creating goal!');
        }
      );
    }
  }
  
  

  updateSavedAmount(targetAmount: number): void {
    const savedAmount = this.goalForm.value.savedAmount - targetAmount;
    this.goalForm.patchValue({ savedAmount });
    localStorage.setItem(`savedAmount_${this.userId}`, savedAmount.toString());
  }
  

  calculateAndStoreProgress(): void {
    if (!this.userId) {
      console.error('User ID is missing. Cannot store progress data.');
      return;
    }
  
    this.goals.forEach((goal) => {
      // Calculate progress for the current goal
      const calculatedProgress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100) || 0;
  
      // Update goal object
      goal.progress = calculatedProgress;
  
      // Call the service to update progress in the database
      this.goalService.updateGoalProgress(goal._id, calculatedProgress).subscribe(
        (response) => {
          console.log(`Progress updated for goal: ${goal._id}`, response);
        },
        (error) => {
          console.error(`Failed to update progress for goal: ${goal._id}`, error);
        }
      );
    });
  }

  resetGoalForm(): void {
    this.goalForm.reset({
      title: '',
      description: '',
      targetAmount: 0,
      savedAmount: this.goalForm.value.savedAmount,
      deadline: '',
      progress: 0
    });
  }
}
