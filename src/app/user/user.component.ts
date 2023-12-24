import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../firebase/auth';
import { UserService, FirebaseUserModel } from '../firebase/user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [UserService, AuthService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm!: FormGroup;
  displayNameAlreadySetted: boolean = true;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.userService.getCurrentUser().then(user => {

      if (user.providerData[0].providerId == 'password') {
        if (user.displayName)
          this.user.name = user.displayName;
        this.user.provider = user.providerData[0].providerId;
      }
      else {
        if (user.displayName)
          this.user.name = user.displayName;
        this.user.provider = user.providerData[0].providerId;
      }
      if (!this.user.name) {
        this.displayNameAlreadySetted = true;
      }
      this.createForm(this.user.name);

      })
  }

  createForm(name: any) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required]
    });
  }

  save() {
    this.userService.updateCurrentUser({ name: this.profileForm.controls['name'].value })
      .then(res => {
        console.log(res);
      }, err => console.log(err))
  }

  logout() {
    this.authService.doLogout().then(() => {
      this.router.navigate(['/login']);
    }, err => {
      console.log(err);
    });
  }

}