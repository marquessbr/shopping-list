import { Action } from "@ngrx/store"

export const LOGIN_START = '@AUTH-LOGIN_START'
export const AUTHENTICATE_SUCCESS = '@AUTH-LOGIN'
export const AUTHENTICATE_FAIL = '@AUTH-LOGIN_FAIL'
export const SIGNUP_START = '@AUTH-SIGNUP_START'
export const CLEAR_ERROR = '@AUTH-CLEAR_ERROR'
export const AUTO_LOGIN = '@AUTH-AUTO_LOGIN'
export const LOGOUT = '@AUTH-LOGOUT'

export class AuthenticateSucces implements Action {
    readonly type = AUTHENTICATE_SUCCESS

    constructor(
        public payload: {
            email: string
            userId: string
            token: string
            expirationDate: Date
        }
    ) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL

    constructor(public payload: string) {}
}

export class Logout implements Action {
    readonly type = LOGOUT
}

export class LoginStart implements Action {
    readonly type = LOGIN_START

    constructor(public payload: {email: string; password: string;}) {}
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START

    constructor(public payload: {email: string; password: string;}) {}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN
}

export type AuthActions = 
    | AuthenticateSucces 
    | Logout 
    | LoginStart 
    | AuthenticateFail 
    | SignupStart
    | ClearError
    | AutoLogin

