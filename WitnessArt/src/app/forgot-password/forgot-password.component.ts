import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'] // optional
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    const email = this.forgotForm.get('email')?.value;
    if (!email) return;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        Swal.fire('Success!', 'Password reset link sent to your email.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to send reset link. Please try again.', 'error');
      }
    });
  }
}
