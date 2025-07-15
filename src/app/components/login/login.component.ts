import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from '../../services/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  isLogin: boolean = true;
  errorMessage: string = '';
  verificationCode: string = '';
  isVerificationStep: boolean = false;


  constructor(private authService: Services, private router: Router) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  private storeToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }
  submit() {
    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  private login() {
    this.authService.login(this.email, this.password).subscribe({
      next:(response) => {
        console.log('User autentificat', response);
        this.storeToken(response.token);
        this.router.navigate(['/home']);
        this.errorMessage = '';
      },
      error: error => {
        console.error('Eroare la autentificare', error);

        if (error.status === 401) {
          this.errorMessage = 'Email sau parolă incorectă.';
        } else {
          this.errorMessage = 'A apărut o eroare neașteptată. Încearcă din nou.';
        }
      }}
    );
  }


  private register() {
    localStorage.removeItem('authToken');
    this.authService.register(this.email, this.password, this.firstName, this.lastName, this.phone).subscribe({
      next:(response) => {
        console.log('User înregistrat', response);
        this.isVerificationStep = true;
      },
      error:error => {
        console.error('Eroare la înregistrare', error);
        this.errorMessage = 'Registrare eșuată';
      }}
    );
  }

  verifyCode() {
    console.log('Trimitem codul spre backend:', this.email, this.verificationCode);

    this.authService.verifyCode(this.email, this.verificationCode).subscribe({
     next:(response) => {
        console.log('Cod verificat', response);
        window.location.reload();
      },
      error:error => {
        console.error("error: ",error);
        this.errorMessage = 'Cod incorect sau expirat.';
      }}
    );
  }

  resendCode(){
    this.authService.resendCode(this.email).subscribe({
      next:(response) => {
        console.log('Cod retrimis', response);
      },
      error:error => {
        console.error("error", error);
        this.errorMessage = 'Codul nu a putut fi retrimis.';
      }}
    );
  }

  forgotPassword() {
      this.authService.forgotPassword(this.email).subscribe({
      next:() => {
          alert('Email trimis cu instrucțiuni pentru resetare parolă.',);
          this.router.navigate(['/login']);
        },
        error:err => {
          console.error('Eroare:', err);
        }}
      );
  }

}
