import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//Pages
import { TestReviewPage } from '../test-review/test-review';


@Component({
  selector: 'page-questions-review',
  templateUrl: 'questions-review.html'
})
export class QuestionsReviewPage {
  answers: any[] = [];
  questions: any[] = [];
  correctNum: number = 0;
  totalQuestions: number = undefined;
  wrongNum: number = undefined;
  testNum: number = 10;
  testTakenId: string  = "";
  userToken: string = "";
  userId: string = "";
  testTitle: string = "";
  
  constructor(public _nav: NavController, public _navP: NavParams) {
    
    this.answers = this._navP.get("answers");
    this.testTitle = this._navP.get("testTitle");
    this.questions = this._navP.get("questions");
    this.testTakenId =  this._navP.get("testTakenId");
    this.totalQuestions = this.questions.length;
    this.userToken = window.localStorage.getItem('userToken');
    this.userId = window.localStorage.getItem('userId');
  }
  
  ionViewWillEnter(){
        gradeAnswers( this.questions, this.answers )
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionsReviewPage');
    let length = this.questions.length
    for (var i = 0; i < length; i++){
      this.questions[i].imgArray = this.questions[i].imageIds.split(",")
    }
  }
reviewQuestion = function ( question, questionIndex ) {
  console.log("question", questionIndex)
  this._nav.push(TestReviewPage, {
    "testTitle": this.testTitle,
    "questions": this.questions,
    "currentQuestion": questionIndex
  })
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