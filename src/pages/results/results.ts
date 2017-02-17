import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, App, AlertController} from 'ionic-angular';
//import { Chart } from 'chart.js';
//Pages
import { LandingPage } from '../landing/landing';
import { QuestionsReviewPage } from '../questions-review/questions-review';
//Providers
import { RestUser } from '../../providers/rest-user';
import { RestTests } from '../../providers/rest-tests';

@Component({
  selector: 'page-results',
  templateUrl: 'results.html'
})
export class ResultsPage {
  
  @ViewChild('doughnutCanvas') doughnutCanvas;
  
  doughnutChart: any;
  loadProgress: number;
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
          if(res[i].userAnswerIds.length === res[i].totalCount){
            completedTests.push(res[i]);
          }
        }
        for (let i = 0; i < completedTests.length; i++){
          this.loadProgress =  100*completedTests[i].totalCorrect / completedTests[i].totalCount;
          completedTests[i].loadProgress = this.loadProgress;
        }
        console.log("tests done", completedTests)
      }, err => {
       this.answersError()
      })
      console.log("Results constructor")
  }
  
  ionViewWillEnter(){
    
    // this.drawChart(7,10);  
  }
  
  //Doughnut chart
  // drawChart(correct, total) {
  //   return this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
  //     type: 'doughnut',
  //     data: {
  //       labels: ["Right", "Wrong"],
  //       datasets: [{
  //         label: '# of Votes',
  //         data: [correct, total],
  //         backgroundColor: [
  //           'rgba(30, 215, 96, 0.2)',
  //           'rgba(255, 99, 132, 0.2)'
  //         ],
  //         hoverBackgroundColor: [
  //           "#08f95e",
  //           "#FF6384"
  //         ]
  //       }]
  //     }
  //   });
  // }
  
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
              "testTitle": test.title,
              "totalCorrect": test.totalCorrect
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
