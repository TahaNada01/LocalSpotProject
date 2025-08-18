import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    })
    .overrideComponent(LoginComponent, {
      set: {
        template: `
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <input formControlName="email" type="email" />
            <input formControlName="motDePasse" type="password" />
            <button type="submit">Login</button>
            <div *ngIf="errorMessage">{{errorMessage}}</div>
          </form>
        `
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.value).toEqual({
      email: '',
      motDePasse: ''
    });
  });

  it('should call login service on submit', () => {
    const mockResponse = { token: 'test-token', refreshToken: 'refresh-token' };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      motDePasse: 'password'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      motDePasse: 'password'
    });
  });
});