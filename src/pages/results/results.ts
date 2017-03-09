
import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController, ToastController} from 'ionic-angular';
//import { Chart } from 'chart.js';
//Pages
import { QuestionsReviewPage } from '../questions-review/questions-review';
//Providers
import { UserService} from '../../providers/user-service';
import { TestService} from '../../providers/test-service';

@Component({
  selector: 'page-results',
  templateUrl: 'results.html'
})
export class ResultsPage {

  // ChartsJs 
  // @ViewChild('doughnutCanvas') doughnutCanvas;

  doughnutChart: any;
  showResults: boolean;
  loadProgress: number;
  userId: string = "";
  userToken: string = "";
  completedTests: any[] = [];
  questions: any[] = [];

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public userService: UserService, public testService: TestService, public alertCtrl: AlertController,
    public toastCtrl: ToastController)
  {
    this.userId = window.localStorage.getItem('userId');
    this.userToken = window.localStorage.getItem('userToken');

    this.testService.getCompletedTests( this.userId, this.userToken )
      .map(res => res.json())
      .subscribe(res => {
        console.log("did enter: ", res)
        for (let i = 0; i < res.length; i++){
          if(res[i].userAnswerIds.length === res[i].totalCount){
            this.completedTests.push(res[i]);
            this.completedTests = this.completedTests.reverse();
          }
        }
        for (let i = 0; i < this.completedTests.length; i++){
          this.loadProgress = 100*this.completedTests[i].totalCorrect / this.completedTests[i].totalCount;
          this.completedTests[i].loadProgress = this.loadProgress;
        }
        console.log("tests done", this.completedTests)
      }, err => {
       this.answersError()
      })
      console.log("Results constructor")

  }

  ionViewWillEnter() {
    if(this.completedTests.length == 0) {
      this.showResults = false;
      console.log('ionViewWillEnter');
    }
  }

  noResults() {
    let alert = this.alertCtrl.create({
      title: "Doesn't look like you've taken any test.",
      subTitle: "After completing a test you'll be able to review the results here." ,
      buttons: ['Dismiss']
    });
    alert.present();
  }


  reviewTest(test){
    this.testService.getQuestions(test.testId, this.userToken)
    .map(res => res.json())
      .subscribe(res => {
        this.questions = res[0].questionIds;
        this.testService.getUserAnswers(test.id, this.userToken)
          .map(res => res.json())
          .subscribe(res => {
            
             this.app.getRootNav().push(QuestionsReviewPage, {

              "questions": this.questions,
              "answers": res,
              "testTakenId": test.testId,
              "testTitle": test.title,
              "totalCorrect": test.totalCorrect,
              "purpose": test.purpose
            })
          }, err => {
            this.answersError();
          })
      }, err => {
        this.answersError();
      })

  }

  //Alert for if error getting answers
  answersError() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Something Went Wrong Please Try Again.',
      buttons: ['Dismiss']
    });
    alert.present();
  }


}
