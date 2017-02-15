import { Component } from '@angular/core';
import { NavController, App, AlertController} from 'ionic-angular';
// Pages
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
// Providers
import { RestUser} from '../../providers/rest-user';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})
export class LandingPage {

 constructor(public _nav: NavController,public _restUser: RestUser, private _app: App,
      public _alert: AlertController) {
    
  }
  
  // Empty User object to be filled by loginForm()
  user = {
    email: "",
    password: ""
  };

  //Invoked by login button
  signinForm(form) {
    if(form.invalid) 
      return this.invalidFormAlert()
    this._restUser.login(this.user)
     .map(res => res.json())
      .subscribe(res => {
        window.localStorage.setItem('userToken', res.id);
        window.localStorage.setItem('userId', res.userId);
        this._nav.setRoot(TabsPage);
      }, err => {
       if (err.status == 401){
          this.wrongInfoAlert()
        } else if ( err.result != 401) {
          this.loginAlert()
        }
      });
  }
  
  //Alert for invalid form 
  invalidFormAlert() {
    let alert = this._alert.create({
      title: 'Error',
      subTitle: 'Please Fill Out All Fields',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  
   //Alert If User Inputs wrong password or email in login
  wrongInfoAlert(){
      let alert = this._alert.create({
      title: 'Error',
      subTitle: "Incorrect Username or Password. Please Try again.",
      buttons: ['Dismiss']
    });
    alert.present();
  }
  
  //Generic alert that covers other error response codes
  loginAlert() {
    let alert = this._alert.create({
      title: 'Error',
      subTitle: "Something Went Wrong. Please Try Again.",
      buttons: ['Dismiss']
    });
    alert.present();
  }
  
  //register button press changes to register state
    register() {
        this._nav.push(RegisterPage);
    }
}
