import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/login-request.model';
import { LoginResponse } from '../../../core/models/login-response.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
  
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: LoginResponse) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']); //redirection
        },
        error: (err) => {
          this.errorMessage = ' Invalid email or password.';
          console.error(err);
        },
      });
    }
  }
}
