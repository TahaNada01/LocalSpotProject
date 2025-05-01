import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  successMessage = '';
  errorMessage = '';
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      ville: ['', Validators.required],
      role: ['USER']
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
  
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          this.successMessage = 'Registration successful';
          this.registerForm.reset(); 
        },
        error: (err: any) => {
          this.errorMessage = 'Registration failed. Please try again.';
          console.error(err);
        },
      });
    }
  }
  
}
