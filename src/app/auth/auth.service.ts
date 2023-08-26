import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, tap, throwError } from "rxjs";

import { AuthResponseData, urlAuthLogin, urlAuthSignUp } from "../shared/consts";
import { User } from './user.model'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new Subject<User>()
    constructor(private http: HttpClient) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
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
        return this.http.post<AuthResponseData>(urlAuthLogin, {
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

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const lUser = new User(email, userId, token, expirationDate)
        this.user.next(lUser)
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

