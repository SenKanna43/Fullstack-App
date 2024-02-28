import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export default class ForgotPasswordComponent {

  fb = inject(FormBuilder)
  authService = inject(AuthService)
  router = inject(Router)

  forgetForm !: FormGroup

  ngOnInit(): void {
    this.forgetForm = this.fb.group(
      {
        email: ["", Validators.compose([Validators.email, Validators.required])],
      },
    )
  }

  submit() {
    this.authService.sendEmaliSercie(this.forgetForm.value.email)
      .subscribe({
        next: (res) => {
          alert(res.message)
          this.forgetForm.reset()
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

}
