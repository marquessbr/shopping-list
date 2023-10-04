import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { Store } from "@ngrx/store";

import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer'

@Injectable({providedIn: 'root'})
class PermissionsService {
    constructor(
      private authService: AuthService, private router: Router,
      private store: Store<fromApp.AppState>) {}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
        Observable<boolean|UrlTree> 
        | Promise<boolean|UrlTree>
        | boolean|UrlTree {
        return this.store.select('auth').pipe(
          take(1),
          map(authState => authState.user),
          map(user => {
            const isAuth = !!user
            if (isAuth) return true
            return this.router.createUrlTree(['/auth'])
        }))
    }
}
  
  export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean|UrlTree> 
  | Promise<boolean|UrlTree>
  | boolean|UrlTree => {
    return inject(PermissionsService).canActivate(next, state);
  }