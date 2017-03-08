import { Component } from '@angular/core';
import { ModalController, NavController, App,  AlertController } from 'ionic-angular';
// Pages
import { TestViewPage } from '../test-view/test-view';
import { LoginPage } from '../login/login';
//Providers
import { TestService } from './../../providers/test-service';
import { UserService } from './../../providers/user-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tests: any[] = [];
  userToken: any;
  userId: any;
  unfinishedTests: any;
  numOfUnfinishedTests: number = undefined;
  test: number = 0;
  clickedTest: any = {};

  constructor(public navCtrl: NavController, public modal: ModalController,
    public userService: UserService, public testService: TestService,
    public app: App, public alertCtrl: AlertController)
  {
    //Retrieves userId from local storage
    this.userId = window.localStorage.getItem('userId');
    this.userToken = window.localStorage.getItem('userToken');

     //Get Unfinished Tests
  this.testService.getUnfinishedTests(this.userId, this.userToken )
    .map(res => res.json())
    .subscribe(res => { 
      console.log("hello", res)
      if ( res.length > 0 ){
        this.unfinishedTests = res
        this.numOfUnfinishedTests = this.unfinishedTests.length
        this.unfinishedTests.forEach( (unfinishedTest, index) => {
            for ( let i = 0; i < this.unfinishedTests.length; i++){
              unfinishedTest.currentQuestion = unfinishedTest.userAnswerIds.length
              unfinishedTest.answers = []
              unfinishedTest.userAnswerIds.forEach( (answer) => 
                unfinishedTest.answers.push( answer.answer )
              )
            }
            this.testService.getSpecificTest( unfinishedTest.testId, this.userToken)
              .map(res => res.json())
              .subscribe(res => {
                this.unfinishedTests[index].questionIds = res[0].questionIds
              }, err => {
                this.loginAlert();
              })
        })
      }
    }, err => {
      this.loginAlert();
    }
  );

    //Gets all tests
    this.testService.getTests(this.userToken )
      .map(res => res.json())
      .subscribe(res => {
        this.tests = res;
        console.log( "tests", this.tests);
      }, err => {
        this.loginAlert();
      })
  

    
  };
  
   
  
// error handing for getting tests
  loginAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: "Something Went Wrong. Please Try Again.",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  /*Click when user goes to take test. Passes in the clicked test and creates a new
  test taken record on backend that the user owns*/
  takeTest(clickedTest){
    let todaysDate = new Date()
console.log(clickedTest.answerChoices);
    let userTest = {
      "userId": this.userId,
      "testId": clickedTest.id,
      "createDate": todaysDate,
      "totalCorrect": 99999,
      "totalCount":  clickedTest.questionIds.length,
      "title": clickedTest.title,
      "answerChoices": clickedTest.answerChoices
     }

    this.testService.createUserTest( userTest , this.userToken )
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
        
        // TODO?: fetched images then ran the rest of the ...getRootNav()... - John
        this.app.getRootNav().setRoot(TestViewPage,{
          "testId": clickedTest.id,
          "testTakenId": res.id,
          "questions": clickedTest.questionIds,
          "currentQuestion": 0,
          "answers": [],
          "testTitle": clickedTest.title,
          "answerChoices": clickedTest.answerChoices
        });
      }, err => {
        alert("Something went really wrong.");
      });
  };
  
  // resumes the test and passes data to next page
  resumeTest( test ){
    let length = test.questionIds.length
      for (var i = 0; i < length; i++){
        test.questionIds[i].imgArray = test.questionIds[i].imageIds.split(",");
      }
      
    console.log(" clicked resume", test)
  this.app.getRootNav().setRoot(TestViewPage,{
    "testId": test.testId, 
    "testTakenId": test.id, 
    "questions": test.questionIds,
    "currentQuestion": test.answers.length,
    "answers": test.answers,
    "testTitle": test.title,
    "answerChoices": test.answerChoices
      })
  }

  //Logout Confirm alert
  logoutConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to logout?',
      //message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Cancel',
          class: 'cancel-btn',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
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
    this.userService.logout(window.localStorage.getItem('userToken'))
     .map(res => {
    // If request fails, throw an Error that will be caught
      if(res.status < 200 || res.status >= 300) {
        throw new Error('This request has failed ' + res.status);
      } else {
        return res.json();
        }
    })
      .subscribe ( res => {
        window.localStorage.clear();
        this.app.getRootNav().setRoot(LoginPage);
        },
        err => {
          window.localStorage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        }
      )
  }

}
