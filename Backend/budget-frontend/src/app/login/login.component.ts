import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // Import necessary modules
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import Snackbar
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule,CommonModule,FormsModule], // Use ReactiveFormsModule here
  standalone: true,
})
export class LoginComponent {
  loginForm: FormGroup; // Define form group

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    // Initialize the form group with form controls
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return; // Do not proceed if the form is invalid
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // Save the token
        localStorage.setItem('userId', res.userId); // Save the user ID
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 }); // Success message
        this.router.navigate(['/budget']); // Navigate to budget page
      },
      error: (err) => {
        this.snackBar.open('Login failed', 'Close', { duration: 3000 }); // Error message
      },
    });
  }
}