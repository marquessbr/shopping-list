import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { Router } from "@angular/router";

import { IAuthResponseData, IUserData, urlAuthLogin, urlAuthSignUp } from "../shared/consts";
import { User } from './user.model'


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null)
    private tokenDelay: any

    constructor(private http: HttpClient, private router: Router) { }

    signUp(email: string, password: string) {
        return this.http.post<IAuthResponseData>(
            urlAuthSignUp,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(
            catchError(this.handleError), 
            tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            })
        )
    } // end signup method

    login(email: string, password: string) {
        return this.http.post<IAuthResponseData>(urlAuthLogin, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            })
        )
    } // end login method

    autoLogin() {
        const userData: IUserData = JSON.parse(localStorage.getItem('userData'))
        if (!userData) return

        const loadedUser = new User(userData.id, userData.email, userData._token, new Date(userData._tokenExpirationDate))

        if (loadedUser) {
            this.user.next(loadedUser)
            const loginDelay = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            this.autoLogout(loginDelay)
        }

    }

    logout() {
        this.user.next(null)
        this.router.navigate(['/auth'])
        localStorage.removeItem('userData')
        if (this.tokenDelay) clearTimeout(this.tokenDelay)
        this.tokenDelay = null
    }

    autoLogout(delay: number) {
       this.tokenDelay = setTimeout(() => {
            this.logout()
        }, delay)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const lUser = new User(email, userId, token, expirationDate)
        this.user.next(lUser)
        this.autoLogout(expiresIn * 1000)
        const userDataStg = JSON.stringify(lUser)
        localStorage.setItem('userData', userDataStg)
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!'
        if (!errorResponse.error || !errorResponse.error.error) {
            const errMsg = new Error(errorMessage)
            console.log("ERRO MSG", errMsg)
            return throwError(() => errMsg)
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS': errorMessage = 'This email already exist!'; break;
            case 'EMAIL_NOT_FOUND': errorMessage = 'This email does not exist!'; break;
            case 'INVALID_PASSWORD': errorMessage = 'Incorrect password!'; break;
            case 'USER_DISABLED': errorMessage = 'Usuario bloqueado'; break;
        }

        return throwError(() => new Error(errorMessage))
    }

}

