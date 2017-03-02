import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
//Pages
import { HomePage } from '../home/home';
import { ResultsPage } from '../results/results';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ResultsPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
