import { environment } from "src/environments/environment"
export interface IAuthResponseData {
    kind?: string           // Unknown param in my firebase version.
    idToken: string         // A Firebase Auth ID token for the newly created user.
    email: string           // The email for the newly created user.
    refreshToken: string    // A Firebase Auth refresh token for the newly created user.
    expiresIn: string       // The number of seconds in which the ID token expires.
    localId: string         // The uid of the newly created user.
    registered?: boolean    // Whether the email is for an existing account. 
}

export interface IUserData {
    email: string;
    id: string;
    _token: string;
    _tokenExpirationDate: string;
}

const KEY_API = environment.firebaseAPIKey

export const urlAuthSignUp = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${KEY_API}`
export const urlFirebaseDb = 'https://ng-recipe-book-ef06c-default-rtdb.firebaseio.com'
export const urlAuthLogin  = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY_API}`