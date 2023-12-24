import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthService {

  constructor( public afAuth: AngularFireAuth ) {}

  doRegister(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);   
  }

  doLogin(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  doLogout() {
    return this.afAuth.signOut();
  }

  async authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async checkLogin(): Promise<User> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

}
