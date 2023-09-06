import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
class PermissionsService {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
        Observable<boolean|UrlTree> 
        | Promise<boolean|UrlTree>
        | boolean|UrlTree {
        return this.authService.user.pipe(map(user => {
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