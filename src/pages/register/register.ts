import { Component } from '@angular/core';
import { NavController, AlertController, Platform, App } from 'ionic-angular';
//Pages
import { TabsPage } from '../tabs/tabs';
//Providers
import { UserService } from '../../providers/user-service';

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
    age: "",
    occupation: "",
    email: "",
    password: ""
  };

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public alertCtrl: AlertController,
    public platform: Platform,
    public app: App)
  {}

  checkPlatform(){
   console.log("hello", this.platform.is('core'))
    //this.app._setDisableScroll(true);
    if( this.platform.is('core')) {
      this.app._setDisableScroll(true);
    }
    if( this.platform.is('android')){
      console.log('Platform = Android');
      this.app._setDisableScroll(true);
    }
  }
  //Invoked by Register button, registers new user on backend
  registerForm(form) {
    if(form.invalid)
      return this.invalidFormAlert();
    this.userService.register(this.user)
      .map(res => res.json ())
      .subscribe(res => {
        window.localStorage.setItem('userToken', res.token);
        window.localStorage.setItem('userId', res.id);
        window.localStorage.setItem('email', this.user.email);
        window.localStorage.setItem('userName', this.user.email);
        this.navCtrl.setRoot(TabsPage);
      }, err => {
        if (err.status == 422){
          this.emailInUseAlert();
      }
    });
  }

  emailInUseAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Email is already in use',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  invalidFormAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Please Fill Out All Fields',
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
