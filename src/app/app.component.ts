import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform, AlertController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
//Services
import { UserService } from '../providers/user-service';
//Pages
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { SupportPage } from '../pages/support/support';
import { TutorialPage } from '../pages/tutorial/tutorial';


export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // set our app's pages
  appPages: PageInterface[] = [
    { title: 'Test', component: TabsPage, icon: 'paper' },
    { title: 'Results', component: TabsPage, index: 1, icon: 'stats' }
  ];
  sideMenuPages: PageInterface[] = [
    { title: 'Account', component: AccountPage, icon: 'person' },
    { title: 'Support', component: SupportPage, icon: 'help' },
    { title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  

  rootPage: any;

  constructor(
    public events: Events,
    platform: Platform,
    public menu: MenuController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public userService: UserService)
  {

    // Check if the user has already seen the tutorial
    if(window.localStorage.getItem('hasSeenTutorial')) {
      this.rootPage = window.localStorage.getItem('userToken') ? TabsPage : LoginPage;
    }
    else {
      this.rootPage = TutorialPage;
    }
    platform.ready().then(() => {
      Splashscreen.hide();
    });

    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
        this.logoutConfirm();
    }

  }

  //alert to confirm logout
  logoutConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to logout?',
      //message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            console.log('Agree clicked');
            setTimeout(() => {
              this.logout()
            }, 1000);
          }
        }
      ]
    });
    confirm.present();
  }

  logout() {
    this.userService.logout(window.localStorage.getItem('userToken'))
      .map(res => res.json())
      .subscribe(res => {
        window.localStorage.removeItem('userToken');
        window.localStorage.removeItem("userId");
         this.nav.setRoot(LoginPage);
         this.enableMenu(false);
      }, err => {
        window.localStorage.removeItem('userToken');
        window.localStorage.removeItem("userId");
        this.nav.setRoot(LoginPage);
        this.enableMenu(false);
      });
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }

}
