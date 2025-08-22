import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  successMessage = '';
  errorMessage = '';
  registerForm!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/) // Letters, spaces, apostrophes, hyphens
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      motDePasse: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      ville: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
      ]],
      role: ['USER']
    });

    // Clear error message when user types
    this.registerForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  // Getters for easy access to form controls
  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get motDePasse() { return this.registerForm.get('motDePasse'); }
  get ville() { return this.registerForm.get('ville'); }

  // Get error message for a specific field
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    switch (fieldName) {
      case 'nom':
        if (errors['required']) return 'Username is required';
        if (errors['minlength']) return 'Username must be at least 2 characters';
        if (errors['maxlength']) return 'Username cannot exceed 50 characters';
        if (errors['pattern']) return 'Username can only contain letters, spaces, apostrophes and hyphens';
        break;

      case 'email':
        if (errors['required']) return 'Email is required';
        if (errors['email'] || errors['pattern']) return 'Please enter a valid email address';
        break;

      case 'motDePasse':
        if (errors['required']) return 'Password is required';
        if (errors['minlength']) return 'Password must be at least 8 characters';
        if (errors['maxlength']) return 'Password cannot exceed 128 characters';
        if (errors['pattern']) return 'Password must contain: uppercase, lowercase, number and special character';
        break;

      case 'ville':
        if (errors['required']) return 'City is required';
        if (errors['minlength']) return 'City must be at least 2 characters';
        if (errors['maxlength']) return 'City cannot exceed 100 characters';
        if (errors['pattern']) return 'City can only contain letters, spaces, apostrophes and hyphens';
        break;
    }

    return 'Invalid field';
  }

  // Check if a field has errors
  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.errors && field.touched);
  }

  // Parse server error for more specific message
  private parseServerError(error: any): string {
    if (error?.error) {
      if (typeof error.error === 'string') {
        if (error.error.includes('email') || error.error.includes('Email')) {
          return 'This email address is already in use. Please choose another one.';
        }
        if (error.error.includes('password') || error.error.includes('mot de passe')) {
          return 'Password does not meet security requirements.';
        }
        return error.error;
      }
      
      if (error.error.message) {
        return error.error.message;
      }
    }

    // Messages by HTTP status code
    if (error?.status) {
      switch (error.status) {
        case 400:
          return 'The submitted data is not valid. Please check all fields.';
        case 409:
          return 'This email address is already in use.';
        case 422:
          return 'The submitted data does not meet the required criteria.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'An unexpected error occurred. Please try again.';
      }
    }

    return 'Registration failed. Please try again.';
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    // Mark all fields as touched to show errors
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.isLoading = true;
      
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          this.successMessage = 'Registration successful! You can now log in.';
          this.registerForm.reset({ role: 'USER' });
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage = this.parseServerError(err);
          this.isLoading = false;
          console.error('Registration error:', err);
        },
      });
    } else {
      // Show general error message when form is invalid
      this.errorMessage = 'Please correct the errors below before submitting.';
    }
  }
}