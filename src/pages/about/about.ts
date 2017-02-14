import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController} from 'ionic-angular';
//Pages
import { LandingPage } from '../landing/landing';
import { QuestionsReviewPage } from '../questions-review/questions-review';
//Providers
import { RestUser } from '../../providers/rest-user';
import { RestTests } from '../../providers/rest-tests';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  userId: string = "";
  userToken: string = "";
  completedTests: any[] = [];
  questions: any[] = []
  
  constructor(public app: App, public _nav: NavController, public _navP: NavParams,
    private _restUser: RestUser, private _restTests: RestTests, public _alert: AlertController) 
  {  
    this.userId = window.localStorage.getItem('userId');
    this.userToken = window.localStorage.getItem('userToken');
    let completedTests = [];
    this.completedTests = completedTests;

    this._restTests.getCompletedTests( this.userId, this.userToken ) 
      .map(res => res.json())
      .subscribe(res => {
        console.log("did enter: ", res)
        for (let i = 0; i < res.length; i++){
          if(res[i].answerIds.length === res[i].totalCount){
            completedTests.push(res[i]);
          }
        }
        console.log("tests done", completedTests)
      }, err => {
       this.answersError()
      })
      console.log("about constructor")
  }
  
  ionViewWillEnter(){
  
      
  }
  
  reviewTest(test){
    this._restTests.getQuestions( test.testId, this.userToken )
    .map(res => res.json())
      .subscribe(res => {
        this.questions = res[0].questionIds
        this._restTests.getUserAnswers( test.id, this.userToken, )
          .map(res => res.json())
          .subscribe(res => {
            this._nav.push(QuestionsReviewPage, {
              "questions": this.questions,
              "answers": res,
              "testTakenId": test.testId,
              "testTitle": test.title
            })
          }, err => {
            this.answersError()
          })
      }, err => {
        this.answersError()
      })
    
  }
  
  //Alert for if error getting answers
  answersError() {
    let alert = this._alert.create({
      title: 'Error',
      subTitle: 'Something Went Wrong Please Try Again.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  //alert to confirm logout
  logoutConfirm() {
    let confirm = this._alert.create({
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

  logout() {
    this._restUser.logout(window.localStorage.getItem('token'))
      .map(res => res.json())
      .subscribe(res => {
        window.localStorage.clear();
         this.app.getRootNav().setRoot(LandingPage);
      }, err => {
        window.localStorage.clear();
        this.app.getRootNav().setRoot(LandingPage);
      });
  }
  
}
