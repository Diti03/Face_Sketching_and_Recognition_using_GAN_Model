import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.signupForm = this.fb.group({
      User_Name: ['', Validators.required],
      F_Name: ['', Validators.required],
      L_Name: ['', Validators.required],
      Email_Id: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      Mobile_No: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      Password1: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    const rawDob = this.signupForm.value.dob;
  const formattedDob = new Date(rawDob).toISOString().split('T')[0]; // Format as YYYY-MM-DD


    const newUser= {
      username: this.signupForm.value.User_Name,
      first_name: this.signupForm.value.F_Name,
      last_name: this.signupForm.value.L_Name,
      email: this.signupForm.value.Email_Id,
      dob: formattedDob,
      mobile_number: String (this.signupForm.value.Mobile_No),
      password: this.signupForm.value.Password1,
    };
    

    this.authService.signup(newUser).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Signup successful!',
          toast: true,
          timer: 1800,
          position: 'top',
          showConfirmButton: false,
          width: '35rem'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup error (detailed):', JSON.stringify(err.error, null, 2)); // 👈 Add this line
      
        const errorMessage =
          err?.error?.detail ||
          err?.error?.message ||
          JSON.stringify(err?.error, null, 2) ||
          'Error creating account';
      
        Swal.fire({
          icon: 'error',
          title: 'Signup failed',
          text: errorMessage
        });
      }
      
      
    });
  }
}

