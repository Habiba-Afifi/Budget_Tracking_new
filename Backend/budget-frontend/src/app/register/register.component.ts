import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // Use ReactiveFormsModule
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import Snackbar for notifications
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule,CommonModule,FormsModule], 
  standalone: true,
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar here
  ) {
    // Initialize the FormGroup with FormControls
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.required, 
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5), 
      ]),
    });
  }

  register() {
    // Check if the form is valid
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', { duration: 3000 });
      return;
    }

    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).subscribe({
      next: (res) => {
        this.snackBar.open('User registered successfully!', 'Close', { duration: 3000 }); // Success notification
        this.router.navigate(['/login']); // Navigate to login page
      },
      error: (err) => {
        this.snackBar.open('User Already Exist. Please try again.', 'Close', { duration: 3000 }); // Error notification
      },
    });
  }
}