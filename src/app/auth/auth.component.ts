import { Component, OnDestroy, ViewChild, ViewContainerRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { IAuthResponseData } from "../shared/consts";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true
    isLoading = false
    error: string = null
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective
    private closeSub: Subscription

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

        let authObsv: Observable<IAuthResponseData>

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
              this.showErrorAlert(errorMessage)
            },
        });
      
        form.reset()
    }

    onHandleError() {
        this.error = null
    }

    private showErrorAlert(message: string) {
        const alertHostViewContainerRef = this.alertHost.viewContainerRef
        alertHostViewContainerRef.clear()
        const componentRef = alertHostViewContainerRef.createComponent(AlertComponent)
        componentRef.instance.message = message
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe()
            alertHostViewContainerRef.clear()
        })
        
    }

    ngOnDestroy(): void {
        if (this.closeSub) this.closeSub.unsubscribe()
    }
}