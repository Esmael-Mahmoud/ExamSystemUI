import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports:[FormsModule,CommonModule,ReactiveFormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  message = '';

  constructor(private fb: FormBuilder, private auth: Auth,private router:Router) {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.message = '';
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.message = 'Registration successful!';
        alert('Registration successful!');
        this.loading = false;
        this.registerForm.reset();
        this.router.navigate(['/account/login']);
      },
      error: err => {
        this.message = err.error?.message || 'Registration failed!';
         alert(err.message);
        this.loading = false;
      }
    });
  }
}
