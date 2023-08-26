import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { AuthResponseData } from "../shared/consts";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true
    isLoading = false
    error: string = null

    constructor(
        private authService: AuthService,
        private router: Router) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return
        }

        const email = form.value.email
        const password = form.value.password

        let authObsv: Observable<AuthResponseData>

        this.isLoading = true
        if (this.isLoginMode) {
            authObsv = this.authService.login(email, password)
        } else {
            authObsv = this.authService.signUp(email, password)
        }

        authObsv.subscribe({
            next: (resData) => {
              console.log(resData);
              this.isLoading = false;
              this.router.navigate(['/recipes'])
            },
            error: (errorMessage) => {
              this.isLoading = false;
              this.error = errorMessage;
            },
        });
      
        form.reset()
    }
}