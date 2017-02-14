import { Component, ViewChild } from '@angular/core';
import { NavParams, Tabs, NavController } from 'ionic-angular';
//Pages
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabs: Tabs;
  public tabIndex: Number = 0;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  
 constructor(public _navP:NavParams, public navCtrl: NavController) {
      let tabIndex = this._navP.get('tabIndex');
      if(tabIndex){
        this.tabIndex = tabIndex;
      }
  }
  
  ionViewDidEnter() {
 // this.tabs.select(1);
 }
 
 
}
