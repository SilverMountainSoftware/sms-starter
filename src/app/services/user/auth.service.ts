import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(
        user => {
          resolve(user);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  loginUser(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    window.dispatchEvent(new CustomEvent('user:login'));
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    window.dispatchEvent(new CustomEvent('user:signup'));
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    window.dispatchEvent(new CustomEvent('user:logout'));
    return firebase.auth().signOut();
  }
}
