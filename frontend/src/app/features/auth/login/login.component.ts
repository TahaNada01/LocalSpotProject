import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/login-request.model';
import { LoginResponse } from '../../../core/models/login-response.model';
import { CommonModule } from '@angular/common';

// Custom validator pour l'email (même que dans register)
function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(value)) {
      return { invalidEmail: true };
    }

    const domain = value.split('@')[1];
    if (domain && /^\d+\.\d+$/.test(domain)) {
      return { invalidDomain: true };
    }

    return null;
  };
}

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
  showPassword = false;
  isSubmitting = false;
  private errorTimeout?: any; 
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        emailValidator()
      ]],
      motDePasse: ['', [
        Validators.required,
        Validators.minLength(1) // Au minimum 1 caractère pour le login
      ]],
    });

    // Écouter les changements dans le formulaire pour effacer les erreurs
    this.loginForm.valueChanges.subscribe(() => {
      // Effacer le message d'erreur seulement après un délai et si l'utilisateur tape
      if (this.errorMessage) {
        this.clearErrorAfterDelay();
      }
    });
  }

  // Getters pour faciliter l'accès aux contrôles
  get email() { return this.loginForm.get('email'); }
  get motDePasse() { return this.loginForm.get('motDePasse'); }

  // Messages d'erreur pour les champs
  getEmailErrorMessage(): string {
    const control = this.email;
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) {
      return 'Email is required';
    }
    if (control.errors['invalidEmail']) {
      return 'Invalid email format';
    }
    if (control.errors['invalidDomain']) {
      return 'Invalid email domain';
    }

    return '';
  }

  getPasswordErrorMessage(): string {
    const control = this.motDePasse;
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) {
      return 'Password is required';
    }
    if (control.errors['minlength']) {
      return 'Password is required';
    }

    return '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Effacer le message d'erreur après un délai (seulement si l'utilisateur modifie le formulaire)
  private clearErrorAfterDelay(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    // Attendre 3 secondes après que l'utilisateur a arrêté de taper
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  // Effacer immédiatement le message d'erreur
  clearError(): void {
    this.errorMessage = '';
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = undefined;
    }
  }

  onSubmit(): void {
    // Effacer les messages d'erreur précédents
    this.clearError();
    
    // Marquer tous les champs comme touchés pour afficher les erreurs de validation
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (res: LoginResponse) => {
          localStorage.setItem('token', res.token);
          this.isSubmitting = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isSubmitting = false;
          
          // Messages d'erreur spécifiques selon le statut HTTP
          if (err.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else if (err.status === 400) {
            this.errorMessage = 'Invalid credentials format. Please check your inputs.';
          } else if (err.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else if (err.status === 0) {
            this.errorMessage = 'Network error. Please check your connection.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
          
          console.error('Login error:', err);
          
        },
      });
    }
  }

  ngOnDestroy(): void {
    // Nettoyer le timeout
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }
}