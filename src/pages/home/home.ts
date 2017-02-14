import { Component } from '@angular/core';
import { ModalController, NavController, App,  AlertController } from 'ionic-angular';

// Pages
import { TestViewPage } from '../test-view/test-view';
import { LandingPage } from '../landing/landing';
//Providers
import { RestUser } from '../../providers/rest-user';
import { RestTests } from '../../providers/rest-tests';
//import {Storage, LocalStorage} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tests: any[] = [];
  userToken: any;
  userId: any;
  
  constructor(public _nav: NavController, private _modal: ModalController,
    public _restTests: RestTests, private _restUser: RestUser,
    public app: App, public alertCtrl: AlertController) 
  {
    //Retrieves userId from local storage
    this.userId = window.localStorage.getItem('userId');
    this.userToken = window.localStorage.getItem('userToken');
      
    //Gets all tests
    this._restTests.getTests(this.userToken )
      .map(res => res.json())
      .subscribe(res => {
        this.tests = res
      }, err => {
        alert("Error");
          console.log(err);
      })
  };
  /*Click when user goes to take test. Passes in the clicked test and creates a new 
  test taken record on backend that the user owns*/
  takeTest(clickedTest){
    let todaysDate = new Date()
    
    let userTest = {
      "userId": this.userId,
      "testId": clickedTest.id,
      "createDate": todaysDate,
      "totalCorrect": 0,
      "totalCount":  clickedTest.questionIds.length,
      "title": clickedTest.title
     }
     
    this._restTests.createUserTest( userTest , this.userToken )
      .map(res => {
    // If request fails, throw an Error that will be caught
      if(res.status < 200 || res.status >= 300) {
        throw new Error('This request has failed ' + res.status);
      } else {
           // If everything went fine, return the response
        return res.json();
        }
      })
      .subscribe(res => {
        let length = clickedTest.questionIds.length
        for (var i = 0; i < length; i++){
          clickedTest.questionIds[i].imgArray = clickedTest.questionIds[i].imageIds.split(",")
        }
        this._nav.push(TestViewPage, {
          "testId": clickedTest.id, 
          "testTakenId": res.id, 
          "questions": clickedTest.questionIds,
          "currentQuestion": 0,
          "answers": [],
          "testTitle": clickedTest.title
        });
        //Push to TestViewPage on successful response and send data in _navP
      // this._nav.push(TestViewPage, {
      //     "testId": clickedTest.id, 
      //     "testTakenId": res.id, 
      //     "questions": clickedTest.questionIds,
      //     "currentQuestion": 0,
      //     "answers": [],
      //     "testTitle": clickedTest.title
      //   })
      }, err => {
        alert("Something went really wrong.");
      });
  };
  
  //Logout Confirm alert
  logoutConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Do you still want to logout?',
      //message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
            this.logout()
          }
        }
      ]
    });
    confirm.present();
  }
  //Log user out after agreeing to confirm alert
   logout(){
    this._restUser.logout(window.localStorage.getItem('userToken'))
     .map(res => {
    // If request fails, throw an Error that will be caught
      if(res.status < 200 || res.status >= 300) {
        throw new Error('This request has failed ' + res.status);
      } else {
           // If everything went fine, return the response
        return res.json();
        }
    })
      .subscribe ( res => {
        window.localStorage.clear();
        //this._nav.push(LandingPage);
        this.app.getRootNav().setRoot(LandingPage);
        },
        err => {
          window.localStorage.clear();
          this.app.getRootNav().setRoot(LandingPage);
        }
      )
  }
}
