import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, Events, App, Platform} from 'ionic-angular';
// Pages
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
// Providers
import { UserService} from '../../providers/user-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user: any = {};

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public menu: MenuController,
    public events: Events,
    public alertCtrl: AlertController,
    public app: App,
    public platform: Platform)
  {
    this.checkPlatform();
    // this.getRememberMe();
    if(window.localStorage.getItem('rememberMe')) {
      this.user.rememberMe = true;
      this.user.email = window.localStorage.getItem('email');
    }
  }
  ionViewDidEnter(){
    //this.app._setDisableScroll(true);
  }
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
  
  //Set value to local storage if user would like to be remembered
  setRememberMe() {
    if(this.user.rememberMe) {
      window.localStorage.setItem('rememberMe', 'true');
    } else {
      window.localStorage.removeItem('rememberMe');
    }
  }

  //Invoked by login button
  signinForm(form) {
    if(form.invalid) { return this.invalidFormAlert() };
    this.userService.login(this.user)
      .map(res => res.json())
      .subscribe(res => {
        window.localStorage.setItem('userToken', res.id);
        window.localStorage.setItem('userId', res.userId);
        window.localStorage.setItem('email', this.user.email);
        this.setRememberMe();
        this.navCtrl.setRoot(TabsPage);
        this.menu.enable(true);
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
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Please Fill Out All Fields',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  //Alert If User Inputs wrong password or email in login
  wrongInfoAlert(){
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: "Incorrect Username or Password. Please Try again.",
      buttons: ['Dismiss']
      });
    alert.present();
  }

  //Generic alert that covers other error response codes
  loginAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: "Something Went Wrong. Please Try Again.",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  //register button press changes to register state
  register() {
      this.navCtrl.push(RegisterPage);
      this.events.publish('user:signup');
  }


}
