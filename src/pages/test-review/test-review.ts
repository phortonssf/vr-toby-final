import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
// Providers
import { RestTests } from '../../providers/rest-tests';
import { RestUser } from '../../providers/rest-user';
import { TabsService } from '../../providers/tabs-service';
//Pages
//import { ResultsPage } from '../results/results';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'test-review',
  templateUrl: 'test-review.html'
})
export class TestReviewPage {
  @ViewChild('testSlider') testSlider: any;
 
  private photos: any[] = [];
  testId: any;
  public imageIds: any[] = [];
  currentIndex: any;
  userToken: string = "";
  testTakenId: string = "";
  questions: any[] = [];
  currentQuestion: number;
  test: any;
  answers: any[] = [];
  viewPic: string;
  imageIndex: any = 0;
  
  testTitle: string = "";
  answerToShow: string ="";
  userAnswerToShow: string ="";
  //length: number = 
  
  constructor(public _nav: NavController, private _modal: ModalController,
    private _restTests: RestTests, private _restUser: RestUser,
    private _navP: NavParams, private alertCtrl: AlertController, public tabs: TabsService) 
  {
    //Hides Tabs
    this.tabs.hide();
    //Get data from _navP pass from previous page with _nav
    this.testId =  this._navP.get("testId");
    this.questions = this._navP.get("questions");
    this.testTitle = this._navP.get("testTitle");
    this.currentQuestion = this._navP.get("currentQuestion");
    this.answerToShow = this.questions[this.currentQuestion].answer;
    this.userAnswerToShow = this.questions[this.currentQuestion].answerGiven;
    //this.answers = this._navP.get("answers");     this.questions[this.currentQuestion].imageIds.length;
    
    //Local staorage
    this.userToken = window.localStorage.getItem('userToken');

    //gets photos
   this.createPhotos(this.questions[this.currentQuestion].imgArray); 
    
  }
  
 //Select image to View
  selectImage(img, i) {
    this.viewPic = img;
    this.imageIndex = i;
  }

//Creates Modal on click of the main image.
  imageZoom() {
    let modal = this._modal.create(GalleryModal, {
    photos: this.photos,
    initialSlide: this.imageIndex
    //initialSlide: this.currentQuestion
  });
  modal.present();
  }

//Creates Photos to be displayed for the current question
createPhotos(questionImages) {
  for (let i = 0; i < questionImages.length; i++) {
      this.photos.push({
        url: `http://ec2-52-32-39-215.us-west-2.compute.amazonaws.com/api/ImageContainer/image-container/download/` + questionImages[i],
      });
    }
    this.viewPic = this.photos[0].url;
  };

//Logs user out

  closeTest() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to return to results history?',
     // message: 'Your progess will be saved and you can resume at a later time',
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
           this._nav.push(TabsPage,{
             "tabIndex": 1
           });
          }
        }
      ]
    });
    confirm.present();
  }
  
  nextPage(num){
    console.log(num)
  this.currentQuestion = this.currentQuestion + num;
    this._nav.push(TestReviewPage, {
      "testTitle": this.testTitle,
      "questions": this.questions,
      "currentQuestion": this.currentQuestion
      
    })
  }
  /*On click from user on asnwer button updates answer if one already exists for 
  the user on this question or test or creates*/
  // selectAnswer(answerPicked){
  //   this.answers[this.currentQuestion]=answerPicked
  //   let answerData ={
  //     "questionId": this.questions[this.currentQuestion].id,
  //     "answer": answerPicked,
  //     "testTakenId": this.testTakenId
  //   }
  //   console.log("photos", this.photos)
  //   this._restTests.saveAnswer(answerData, this.userToken)
  //   .map(res => {
  //   // If request fails, throw an Error that will be caught
  //     if(res.status < 200 || res.status >= 300) {
  //       throw new Error('This request has failed ' + res.status);
  //     } else {
  //         // If everything went fine, return the response
  //       return res.json();
  //       }
  //   })
  //   .subscribe( res => {
  //     nextQuestion(this.testTitle, this._nav, this.currentQuestion, this.questions, this.testTakenId, this.answers)
  //   }, err => {
  //       alert("Error Server Could Not Be Found. Try again Later.")
  //       console.log(err)
  //   })
  // }
// }



//handles what data to send to the next question if last question goes to TestResultsPage
// let nextQuestion = function(title,  nav, pageNum, question, takenId, answer){
//     //if last question go to TestResultsPage
//     if( pageNum === question.length-1){
//     console.log("I am length",   question.length-1)
//       nav.setRoot(TestResultsPage, 
//         {
//           "answers": answer,
//           "questions": question,
//           "testTakenId": takenId,
//           "testTitle": title
//         })
//         //Go to nexst question with the data given in navCtrl
//     }else{
//       console.log("title 1", title)
//       ++pageNum
//       nav.push( TestViewPage, { 
//         "currentQuestion": pageNum,
//         "questions": question,
//         "testTakenId": takenId,
//         "answers": answer,
//         "testTitle": title
//       })
//     }
}