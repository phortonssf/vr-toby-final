import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-gallery-modal',
  templateUrl: 'gallery-modal.html'
})
export class GalleryModalPage {

  constructor(public _nav: NavController, public _navP: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryModalPage');
  }

}
