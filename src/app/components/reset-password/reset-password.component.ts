import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Services} from '../../services/services';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  form: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: Services,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    if (this.form.valid && this.token) {
      const payload = {
        token: this.token,
        newPassword: this.form.value.password
      };

      this.service.resetPassword(payload).subscribe(
        () => {
          alert('Parola a fost schimbată cu succes.');
          this.router.navigate(['/login']);
        },
        err => {
          console.error('Eroare la resetare:', err);
        }
      );
    }
  }
}
