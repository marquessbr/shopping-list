import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenDelay: any

  constructor(
    private store: Store<fromApp.AppState>) { }

  setLogoutTimer(delay: number) {
     this.tokenDelay = setTimeout(() => {
          this.store.dispatch(new AuthActions.Logout())
      }, delay)
  }

  clearLogoutTimer() {
    if (this.tokenDelay) {
        clearTimeout(this.tokenDelay)
        this.tokenDelay = null
    }
  }
}

