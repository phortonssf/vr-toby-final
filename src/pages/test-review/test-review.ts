import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
// Providers
import { TestService } from '../../providers/test-service';
import { UserService } from '../../providers/user-service';
//Pages
//import { ResultsPage } from '../results/results';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-test-review',
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

  constructor(public navCtrl: NavController, public modal: ModalController,
    public testService: TestService, public userService: UserService,
    public navParams: NavParams, public alertCtrl: AlertController, public app: App)
  {
    this.testId =  this.navParams.get("testId");
    this.questions = this.navParams.get("questions");
    this.testTitle = this.navParams.get("testTitle");
    this.currentQuestion = this.navParams.get("currentQuestion");
    this.answerToShow = this.questions[this.currentQuestion].answer;
    this.userAnswerToShow = this.questions[this.currentQuestion].answerGiven;
    this.userToken = window.localStorage.getItem('userToken');
    this.createPhotos(this.questions[this.currentQuestion].imgArray);
  }

   ionViewDidEnter(){
    //this.app._setDisableScroll(true);
  }
 
 //Select image to View
  selectImage(img, i) {
    this.viewPic = img;
    this.imageIndex = i;
  }

  //Creates Modal on click of the main image.
  imageZoom() {
    let modal = this.modal.create(GalleryModal, {
    photos: this.photos,
    initialSlide: this.imageIndex
  });
  modal.present();
  }

  //Creates Photos to be displayed for the current question
  createPhotos(questionImages) {
    for (let i = 0; i < questionImages.length; i++) {
      this.photos.push({
        url: `https://vr-toby-jbrownssf.c9users.io:8080/api/ImageContainer/image-container/download/` + questionImages[i],
      });
    }
    this.viewPic = this.photos[0].url;
  };

  closeTest() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to return to results history?',
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
           this.navCtrl.setRoot(TabsPage, {
             "tabIndex": 1
           });
          }
        }
      ]
    });
    confirm.present();
  }

  nextPage(num){
    this.currentQuestion = this.currentQuestion + num;
      this.navCtrl.push(TestReviewPage, {
        "testTitle": this.testTitle,
        "questions": this.questions,
        "currentQuestion": this.currentQuestion
    })
  }


}
