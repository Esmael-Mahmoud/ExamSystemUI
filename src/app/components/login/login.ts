import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports:[CommonModule,ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  message = '';
  constructor(private fb: FormBuilder, private auth: Auth,private router:Router) {
 
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.message = '';
    this.auth.login(this.loginForm.value).subscribe({
      next: (result) => {
        this.message = 'Login successful!';
        this.router.navigate(['/home']);
        console.log(result);
        // localStorage.setItem('token',result.token);  
        this.loading = false;
        this.loginForm.reset();
      },
      error: err => {
        this.message = err.error?.message || 'Login failed!';
        alert(this.message);
        this.loading = false;
      }
    });
  }
}
