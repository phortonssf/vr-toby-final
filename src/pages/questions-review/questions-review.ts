import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App } from 'ionic-angular';
//Pages
import { TestReviewPage } from '../test-review/test-review';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-questions-review',
  templateUrl: 'questions-review.html'
})
export class QuestionsReviewPage {
  answers: any[] = [];
  questions: any[] = [];
  totalCorrect: number = 0;
  totalQuestions: number = undefined;
  wrongNum: number = undefined;
  testTakenId: string  = "";
  userToken: string = "";
  userId: string = "";
  testTitle: string = "";
  purpose: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public app: App
  )
  {
    // this.config.swipeBackEnabled = false;
    this.purpose = this.navParams.get("purpose");
    this.answers = this.navParams.get("answers");
    this.testTitle = this.navParams.get("testTitle");
    this.questions = this.navParams.get("questions");
    this.testTakenId =  this.navParams.get("testTakenId");
    this.totalCorrect =  this.navParams.get("totalCorrect");
    this.totalQuestions = this.questions.length;
    this.userToken = window.localStorage.getItem('userToken');
    this.userId = window.localStorage.getItem('userId');
  }

  ionViewWillEnter(){
    gradeAnswers( this.questions, this.answers )
    console.log(this.purpose)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionsReviewPage');
    
    //Creates arrary from img strings in questions
    let length = this.questions.length
    for (var i = 0; i < length; i++){
      this.questions[i].imgArray = this.questions[i].imageIds.split(",")
    }
  }
  // sets root to testreview-page on app stack and passes in data with nav params
  reviewQuestion = function ( question, questionIndex ) {
      this.app.getRootNav().setRoot(TestReviewPage,{
      "testTitle": this.testTitle,
      "questions": this.questions,
      "currentQuestion": questionIndex
    })
  }

  
  closeTestResult = function(){
    this.navCtrl.setRoot(TabsPage, {
      "tabIndex": 1
    });
  }

   closeTestConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to close test?',
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
            this.closeTestResult()
          }
        }
      ]
    });
    confirm.present();
  }

}






let gradeAnswers = function (questions, answers){
  console.log("answers", answers);
  console.log('questions', questions)
    answers.forEach(function(userAnswer){
      for ( let i = 0; i < questions.length; i++){
        if(userAnswer.questionId == questions[i].id){
          questions[i].answerGiven = userAnswer.answer
        }
      }
    })
}
