import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class UserService {

  constructor(public afAuth: AngularFireAuth) { }

  getCurrentUser(): Promise<User> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(user => {
        user ? resolve(user) : reject('No user logged in');
      });
    });
  }  

}
