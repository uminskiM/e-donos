import { Component, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { AuthService } from '../../services/auth.service';
import { UserOptions } from '../../interfaces/user-options';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { email: '',
  name: '',
  surname: '',
  password: '',
  is_official: false};
  submitted = false;

  constructor(
    private authService: AuthService    ,
    public userData: UserData,
    public router: Router,
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.login(this.login.email);

      const loginData = {
        'email': this.login.email,
        'password': this.login.password
      }

      this.authService.postLogin(loginData)
      .subscribe((success) => {
        console.log("SUCCESS POST")
        this.router.navigateByUrl('/app/tabs/map');
      },
      (error) => {
        console.log("WRONG POST")
      });
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
