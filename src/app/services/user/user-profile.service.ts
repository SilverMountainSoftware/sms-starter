import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile, UserProfileId } from '../../interfaces/user-profile';
import { UserType } from '../../enums/user-type';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private userCollection: AngularFirestoreCollection<UserProfile>;
  users: Observable<UserProfileId[]>;
  constructor(
    private afs: AngularFirestore,
  ) { }

  public getUsers(): Observable<Array<UserProfileId>> {
    this.userCollection = this.afs.collection<UserProfile>('userProfile');
    this.users = this.userCollection.snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as UserProfile;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }));
    return this.users;
  }

  public getAdmins(): Observable<Array<UserProfileId>> {
    this.userCollection = this.afs.collection<UserProfile>('userProfile', ref => ref.where('admin', '==', true ) );
    this.users = this.userCollection.snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as UserProfile;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }));
    return this.users;
  }

  public getRegularUsers(): Observable<Array<UserProfileId>> {
    this.userCollection = this.afs.collection<UserProfile>('userProfile', ref => ref.where('userType', '==', UserType.RegularUser ) );
    this.users = this.userCollection.snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as UserProfile;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }));
    return this.users;
  }

  public getSuperUsers(): Observable<Array<UserProfileId>> {
    this.userCollection = this.afs.collection<UserProfile>('userProfile', ref => ref.where('userType', '==', UserType.SuperUser ) );
    this.users = this.userCollection.snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as UserProfile;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }));
    return this.users;
  }

  public getUnapproved(): Observable<Array<UserProfileId>> {
    this.userCollection = this.afs.collection<UserProfile>('userProfile', ref => ref
      .where('approved', '==', false) );
    this.users = this.userCollection.snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as UserProfile;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }));
    return this.users;
  }

  public getIncompletesOld(): Observable<Array<UserProfileId>> {
    this.userCollection = this.afs.collection<UserProfile>('userProfile', ref => ref
      .where('approved', '==', true) );
    this.users = this.userCollection.snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as UserProfile;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }));
    return this.users;
  }

  // Get data of a specific User
  public getUser(userId: string): Observable<UserProfileId> {
    return this.afs.doc<UserProfile>('userProfile/' + userId)
      .snapshotChanges()
      .pipe(
        map(a => {
          const userData = a.payload.data();
          const id = a.payload.id;
          return { id, ...userData } as UserProfileId;
        })
      );
  }

  public updateUser(user: UserProfileId): Promise<void> {
    return this.afs.collection('userProfile').doc(user.id).set(user);
  }
}
