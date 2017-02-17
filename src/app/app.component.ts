import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { LandingPage } from '../pages/landing/landing'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = window.localStorage.getItem("userToken") ? TabsPage : LandingPage;

  screenMax: any = 900;
  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  // testStyle(event) {
    // let ionNav: any = document.getElementById("testId");
  //   if(ionNav.clientWidth > screenMax) {
      // ionNav.setAttribute("style", "width: " + screenMax + "px; margin: auto; position: relative;");
  //   }
  // }
  }
}
