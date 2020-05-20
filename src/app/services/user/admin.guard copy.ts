import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private profileService: UserService,
  ) {
    console.log('admin guard construct');
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      console.log('Checking Admin');
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          console.log('User is logged in');
          this.profileService.getProfile(user.uid).then(userProfileSnapshot => {
            if (userProfileSnapshot.data()) {
              const userProfile = userProfileSnapshot.data();
              resolve(userProfile.admin);
            }
          });
        } else {
          console.log('User is not logged in');
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }

}
