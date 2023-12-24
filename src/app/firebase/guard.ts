import { inject } from '@angular/core';
import { UserService } from './user';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
    return new Promise((resolve, reject) => {
      const userService: UserService = inject(UserService);
      const router: Router = inject(Router);
      userService.getCurrentUser()
        .then(user => {
          router.navigate(['/dashboard']);
          return resolve(false);
        }, err => {
          return resolve(true);
        });
    });
  };

export const securityInnerGuard: CanActivateFn = (route, state) => {
    return new Promise((resolve, reject) => {
      const userService: UserService = inject(UserService);
      const router: Router = inject(Router);
      userService.getCurrentUser()
        .then(user => {
          return resolve(true);
        }, err => {
          router.navigate(['/login']);
          return resolve(false);
        });
    });
};
  