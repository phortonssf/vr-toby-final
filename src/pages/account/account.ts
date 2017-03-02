import { Component } from '@angular/core';
import { AlertController, NavController, ToastController } from 'ionic-angular';
//Services
import { UserService } from '../../providers/user-service';
//Pages
import { LoginPage } from '../login/login';
import { SupportPage } from '../support/support';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  username: string;

  constructor(
    public alertCtrl: AlertController,
    public nav: NavController,
    public toastCtrl: ToastController,
    public userService: UserService)
  {}

  ionViewDidEnter() {
    // let toast = this.toastCtrl.create({
    //   message: 'Mock Page, waiting for models before implementing.',
    //   duration: 3000
    // });
    // toast.present();
  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.username = data.username;
        this.setUsername(this.username);
      }
    });

    alert.present();
  }

  getUsername() {
    this.username = window.localStorage.getItem('userName') ? window.localStorage.getItem('userName') : window.localStorage.getItem('email');
  }
  
  setUsername(name) {
    window.localStorage.setItem('userName', name);
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.userService.logout(window.localStorage.getItem('userToken')).subscribe((response) => {
      console.log(response);
    })
    this.nav.setRoot(LoginPage);
  }

  support() {
    this.nav.push(SupportPage);
  }
}
