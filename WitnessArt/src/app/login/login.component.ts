import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginFormCustomer!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService  // Inject AuthService
  ) {
    this.loginFormCustomer = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password1: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginFormCustomer.invalid) return;

    const credentials = {
      email: this.loginFormCustomer.get('Email')?.value,
      password: this.loginFormCustomer.get('Password1')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {

        localStorage.setItem('isLoggedIn', 'true');

  // Save token returned by FastAPI
    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
  }
        Swal.fire({
          icon: 'success',
          title: 'Login successful!',
          toast: true,
          timer: 1800,
          position: 'top',
          showConfirmButton: false,
          width: '35rem'
        });

        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/']); // Navigate to home or dashboard
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: err?.error?.detail || 'Invalid credentials'
        });
      }
    });
  }
}

