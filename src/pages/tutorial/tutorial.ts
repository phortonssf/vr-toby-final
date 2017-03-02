import { Component } from '@angular/core';
import { MenuController, NavController, Slides, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public storage: Storage
  ) { }

  startApp() {
    if(window.localStorage.getItem('userToken')) {
      this.navCtrl.setRoot(TabsPage);
    }
    else {
      this.navCtrl.push(LoginPage).then(() => {
        window.localStorage.setItem('hasSeenTutorial', 'true');
      })
    }
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);

    // let toast = this.toastCtrl.create({
    //   message: 'Mock images as placeholder until we receive graphics.',
    //   duration: 3000
    // });
    // toast.present();
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
