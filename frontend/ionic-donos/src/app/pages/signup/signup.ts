import { Component, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { BooleanValueAccessor } from '@ionic/angular';


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
  userForm: FormGroup;


  constructor(
    public router: Router,
    public userData: UserData,
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private authService: AuthService    
  ) {
      this.userForm = this.formBuilder.group({
      name: [''],
      email: [''],
      username: ['']
    })
  }

  onSignup(form: NgForm) { 
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup.email);

      this.authService.createUser(this.signup)
      .subscribe((response) => {
        this.zone.run(() => {
          this.userForm.reset();
          this.router.navigate(['/list']);
        })
      });
  }


      this.router.navigateByUrl('/app/tabs/map');
    }
  
}
