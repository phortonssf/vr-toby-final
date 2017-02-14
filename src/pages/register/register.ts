import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

//Pages

import { TabsPage } from '../tabs/tabs';
//Providers
import { RestUser} from '../../providers/rest-user';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  userId: string = "";
  userToken: string = "";
  user = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  };
  
  constructor(public _nav: NavController, public _restUser: RestUser,
           public _alert: AlertController) {}
 // Invoked by Register button, registers new user on backend
  registerForm(form) {
   // console.log("form: ", form)
    //if form is in valid 
    if(form.invalid) 
      return this.invalidFormAlert();
    //Invokes SSFUserRest service
    this._restUser.register(this.user)
      .map(res => res.json ())
      .subscribe(res => {
        window.localStorage.setItem('userToken', res.token);
        window.localStorage.setItem('userId', res.id);
        this._nav.setRoot(TabsPage);
      }, err => {
        if ( err.status == 422){
          this.emailInUseAlert()
      }
    });
  }
  
  emailInUseAlert() {
    let alert = this._alert.create({
      title: 'Error',
      subTitle: 'Email is already in use',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  invalidFormAlert() {
    let alert = this._alert.create({
      title: 'Error',
      subTitle: 'Please Fill Out All Fields',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  
}