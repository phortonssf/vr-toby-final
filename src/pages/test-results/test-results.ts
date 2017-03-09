import { Component } from '@angular/core';
import { NavController, Nav, NavParams } from 'ionic-angular';
// Providers
import { TestService } from '../../providers/test-service';
import { UserService } from '../../providers/user-service';
//Pages
import { TestReviewPage } from '../test-review/test-review';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-test-results',
  templateUrl: 'test-results.html'
})
export class TestResultsPage {
  answers: any[] = [];
  answerChoices: any;
  questions: any[] = [];
  correctNum: number = 0;
  totalQuestions: number = undefined;
  wrongNum: number = undefined;
  testNum: number = 10;
  testTakenId: string  = "";
  userToken: string = "";
  userId: string = "";
  testTitle: string = "";
  testId: string = ""
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userService: UserService, public testService: TestService,
    public nav: Nav)
  {
    //Get data passed from previous page with navParams
    this.answers = this.navParams.get("answers");
    this.testTitle = this.navParams.get("testTitle");
    this.questions = this.navParams.get("questions");
    this.testTakenId =  this.navParams.get("testTakenId");
    this.testId = this.navParams.get("testId");
    this.answerChoices = this.navParams.get("answerChoices");
    this.totalQuestions = this.questions.length;
    this.userToken = window.localStorage.getItem('userToken');
    this.userId = window.localStorage.getItem('userId');
    //Compares user answers to the answers of the question
    for(var i = 0; i < this.totalQuestions; i++) {
    this.questions[i].answerGiven = this.answers[i]
      if(this.questions[i].answer === this.answers[i]){
        this.correctNum++
      }
      else {
        this.wrongNum++
      }
    }

    let today = new Date();
    let completeTestData =
      {
        "testId": this.testId,
        "userId": this.userId,
        "createDate": today,
        "totalCorrect": this.correctNum,
        "totalCount": this.totalQuestions,
        "id": this.testTakenId
      };

    this.testService.completeTest( completeTestData, this.userToken)
    .map( res => res.json())
    .subscribe( res => {
      console.log("complete test Data", completeTestData)
    }, err => {
      alert("Error this is completeTest error")
      console.log(err)
    })
  }

  closeTestResult(){
    this.navCtrl.setRoot(TabsPage);
  }

  reviewQuestion = function (question, questionIndex) {
    this.navCtrl.push(TestReviewPage, {
      "testTitle": this.testTitle,
      "questions": this.questions,
      "currentQuestion": questionIndex
    })
  }

}
