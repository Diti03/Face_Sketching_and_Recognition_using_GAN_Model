import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    const newPassword = this.resetForm.get('newPassword')?.value;
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => Swal.fire('Success!', 'Password reset successfully.', 'success'),
      error: () => Swal.fire('Error', 'Failed to reset password.', 'error')
    });
  }
}




















