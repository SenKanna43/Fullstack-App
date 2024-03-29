import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/validators/confirm-password.validator';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {

  fb = inject(FormBuilder)
  authService = inject(AuthService)
  registerForm !: FormGroup
  router = inject(Router)


  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", Validators.compose([Validators.email, Validators.required])],
        userName: ["", Validators.required],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required]
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword')
      })
  }

  register() {
    this.authService.registerService(this.registerForm.value)
      .subscribe({
        next: (res) => {
          alert("User Created")
          this.router.navigate(['/login'])
        },
        error: (err) => {
          console.log(err)
        }
      })
  }
}
