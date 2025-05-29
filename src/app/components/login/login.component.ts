import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from '../../services/services';
import {response} from 'express';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLogin: boolean = true;
  errorMessage: string = '';
  verificationCode: string = '';
  isVerificationStep: boolean = false;


  constructor(private authService: Services, private router: Router) {}

  reload(){
    window.location.reload();
  }

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
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('User logged in', response);
        this.storeToken(response.token); // Salvează token-ul
        console.log('Token saved to localStorage:', localStorage.getItem('authToken'));
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error during login', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    );
  }

  private register() {
    localStorage.removeItem('authToken');
    this.authService.register(this.email, this.password).subscribe(
      (response) => {
        console.log('User registered', response);
        this.isVerificationStep = true;
      },
      (error) => {
        console.error('Error during registration', error);
        this.errorMessage = 'Registration failed. Please try again later.';
        //alert("Email invalid")
      }
    );
  }

  verifyCode() {
    console.log('Trimitem codul spre backend:', this.email, this.verificationCode);

    this.authService.verifyCode(this.email, this.verificationCode).subscribe(
      (response) => {
        console.log('Code verificat', response);
        window.location.reload();
      },
      (error) => {
        console.error("error");
        this.errorMessage = 'Codul este incorect sau a expirat.';
      }
    );
  }

  resendCode(){
    this.authService.resendCode(this.email).subscribe(
      (response) => {
        console.log('Cod retrimis', response);
      },
      (error) => {
        console.error("error", error);
        this.errorMessage = 'Codul nu a putut fi retrimit.';
      }
    );
  }

  forgotPassword() {
      this.authService.forgotPassword(this.email).subscribe(
        res => {
          alert('Email trimis cu instrucțiuni pentru resetare parolă.');
          this.router.navigate(['/login']);
        },
        err => {
          console.error('Eroare:', err);
        }
      );

  }



}
