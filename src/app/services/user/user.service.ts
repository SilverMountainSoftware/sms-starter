import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthService } from './auth.service';
import { DocumentData } from '@google-cloud/firestore';
import { UserType } from '../../enums/user-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userProfile: firebase.firestore.DocumentReference;
  public userProfiles: firebase.firestore.CollectionReference<DocumentData>;
  public currentUser: firebase.User;
  constructor(private authService: AuthService) {}

  async getUserProfile(): Promise<firebase.firestore.DocumentSnapshot> {
    const user: firebase.User = await this.authService.getUser();
    this.currentUser = user;
    this.userProfile = firebase.firestore().doc(`userProfile/${user.uid}`);
    return this.userProfile.get();
  }

   async getProfile(uid: string): Promise<firebase.firestore.DocumentSnapshot> {
    this.userProfile = firebase.firestore().doc(`userProfile/${uid}`);
    return this.userProfile.get();
  }

  async getProfiles(): Promise<firebase.firestore.CollectionReference> {
    this.userProfiles = firebase.firestore().collection(`userProfile`);
    return this.userProfiles;
  }

  updateName(uid: string, firstName: string, lastName: string): Promise<void> {
    const aprofile = firebase.firestore().doc(`userProfile/${uid}`);
    return aprofile.set({ firstName, lastName }, { merge: true });
  }

  updateDOB(uid: string, birthDate: string): Promise<any> {
    const aprofile = firebase.firestore().doc(`userProfile/${uid}`);
    return aprofile.set({ birthDate }, { merge: true });
  }

  updateEmailOnly(uid: string, email: string): Promise<any> {
    const aprofile = firebase.firestore().doc(`userProfile/${uid}`);
    return aprofile.set({ email }, { merge: true });
  }

  async initialEmail(newEmail: string): Promise<any> {
    const user: firebase.User = await this.authService.getUser();
    const aprofile = firebase.firestore().doc(`userProfile/${user.uid}`);
    return aprofile.set({ email: newEmail, approved: false, admin: false, userType: '0' }, { merge: true });
  }

  async setEmail(newEmail: string): Promise<any> {
    const user: firebase.User = await this.authService.getUser();
    const aprofile = firebase.firestore().doc(`userProfile/${user.uid}`);
    return aprofile.set({ email: newEmail }, { merge: true });
  }

  updateApproved(uid: string, approved: boolean): Promise<any> {
    const aprofile = firebase.firestore().doc(`userProfile/${uid}`);
    return aprofile.set({ approved }, { merge: true });
  }

  updateAdmin(uid: string, admin: boolean): Promise<any> {
    const aprofile = firebase.firestore().doc(`userProfile/${uid}`);
    return aprofile.set({ admin }, { merge: true });
  }

  updateUserType(uid: string, userType: UserType): Promise<any> {
    const aprofile = firebase.firestore().doc(`userProfile/${uid}`);
    return aprofile.set({ userType }, { merge: true });
  }

  async updateEmail(uid: string, newEmail: string, password: string): Promise<void> {
    try {
      const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
        this.currentUser.email,
        password
      );

      await this.currentUser.reauthenticateWithCredential(credential);
      await this.currentUser.updateEmail(newEmail);
      return this.userProfile.set({ email: newEmail }, { merge: true });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(
    uid: string,
    newPassword: string,
    oldPassword: string
  ): Promise<void> {
    try {
      const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
        this.currentUser.email,
        oldPassword
      );

      await this.currentUser.reauthenticateWithCredential(credential);
      return this.currentUser.updatePassword(newPassword);
    } catch (error) {
      console.error(error);
    }
  }
}
