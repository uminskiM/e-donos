import { Component, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: UserOptions = { email: '',
   name: '',
   surname: '',
   password: '',
   is_official: false };
  submitted = false;


  constructor(
    public router: Router,
    public userData: UserData,
    private authService: AuthService    
  ) {
  }

  onSignup(form: NgForm) { 
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup.email);

      this.authService.createUser(this.signup)
      .subscribe((success) => {
        console.log("SUCCESS POST")
        this.router.navigateByUrl('/app/tabs/map');
      },
      (error) => {
        console.log("WRONG POST")
      });
    }
  }
  
}
