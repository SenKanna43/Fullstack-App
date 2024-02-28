import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {

  fb = inject(FormBuilder)
  authService = inject(AuthService)
  router = inject(Router)

  loginForm !: FormGroup

  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        email: ["", Validators.compose([Validators.email, Validators.required])],
        password: ["", Validators.required],
      },
    )
  }

  login() {
    this.authService.loginService(this.loginForm.value)
      .subscribe({
        next: (res) => {
          alert("Login in Success")
          localStorage.setItem("user_id", res.data._id)
          this.authService.isLoggedIn$.next(true)
          this.router.navigate(['home'])
        },
        error: (err) => {
          alert(err.error.message)
          console.log(err)
        }
      })
  }

}
