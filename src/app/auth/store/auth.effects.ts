import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { IAuthResponseData, IUserData, urlAuthLogin, urlAuthSignUp } from "src/app/shared/consts";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const lUser = new User(email, userId, token, expirationDate)
    const userDataStg = JSON.stringify(lUser)
    localStorage.setItem('userData', userDataStg)
    return new AuthActions.AuthenticateSucces({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
    });
}

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unknown error occurred!'
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage))
    }
    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS': errorMessage = 'This email already exist!'; break;
        case 'EMAIL_NOT_FOUND': errorMessage = 'This email does not exist!'; break;
        case 'INVALID_PASSWORD': errorMessage = 'Incorrect password!'; break;
        case 'USER_DISABLED': errorMessage = 'Usuario bloqueado'; break;
    }

    return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
    authSignup = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((signupAction: AuthActions.SignupStart) => {
                return this.http.post<IAuthResponseData>(urlAuthSignUp,
                    {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
                        returnSecureToken: true,
                    }
                )
                    .pipe(
                        tap(resData => {this.authService.setLogoutTimer(+resData.expiresIn * 1000)}),
                        map((resData) => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
                        catchError((errorResp) => handleError(errorResp))
                    );
            })
        )
    );

    authLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.http.post<IAuthResponseData>(urlAuthLogin,
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true,
                    }
                )
                    .pipe(
                        tap(resData => {this.authService.setLogoutTimer(+resData.expiresIn * 1000)}),
                        map((resData) => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
                        catchError((errorResp) => handleError(errorResp))
                    );
            })
        )
    );

    authRedirect = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.AUTHENTICATE_SUCCESS),
            tap(() => {
                this.router.navigate(['/'])
            })
        ), { dispatch: false }
    );

    autoLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: IUserData = JSON.parse(localStorage.getItem('userData'))
                if (!userData) {
                    return { type: 'DUMMY' }
                }
                const loadedUser = new User(userData.id, userData.email, userData._token, new Date(userData._tokenExpirationDate))
                if (loadedUser.token) {
                    const loginDelay = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                    this.authService.setLogoutTimer(loginDelay)
                    return new AuthActions.AuthenticateSucces({
                        email: userData.email,
                        userId: userData.id,
                        token: userData._token,
                        expirationDate: new Date(userData._tokenExpirationDate)
                    })
                    //this.user.next(loadedUser)
                    // const loginDelay = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                    // this.autoLogout(loginDelay)
                }

                return { type: 'DUMMY' }
            })
        ), { dispatch: true }
    );


    authLogout = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer()
                localStorage.removeItem('userData')
                this.router.navigate(['/auth'])
            })
        ), { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) { }
} 