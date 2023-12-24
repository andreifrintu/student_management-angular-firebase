import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../firebase/auth';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    RouterModule
  ],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  tryRegister() {
    
    this.authService.doRegister(this.f['email'].value, this.f['password'].value)
      .then(res => {
        this.errorMessage = '';
        this.successMessage = 'Your account has been created';
        this.authService.doLogout();
      }, err => {
        this.errorMessage = err.message;
        this.successMessage = '';
      });
  }
}
