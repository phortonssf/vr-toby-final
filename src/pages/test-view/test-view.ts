import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, AlertController, 
App, Platform, Events, ActionSheetController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
// Providers
import { TestService } from '../../providers/test-service';
import { UserService } from '../../providers/user-service';
//Pages
import { TestResultsPage } from '../test-results/test-results';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'test-view',
  templateUrl: 'test-view.html'
})
export class TestViewPage {

  private photos: any[] = [];
  public imageIds: any[] = [];
  currentIndex: any;
  userToken: string = "";
  testTakenId: string = "";
  questions: any[] = [];
  currentQuestion: number = 0;
  test: any;
  loadProgress: number;
  answers: any[] = [];
  viewPic: string;
  imageIndex: any = 0;
  testTitle: string = "";
  testId: string = "";
  currentImg: any = undefined;
  view:any;
  zoom: string = 'Zoom';
  select: string = 'Grade Img';
  heart: any = ['Grade Left', 'Grade Right', 'Grade Vd'];

  constructor(public navCtrl: NavController, public modal: ModalController,
    public testService: TestService, public userService: UserService,
    public navParams: NavParams, public alertCtrl: AlertController,
    private app: App, public platform: Platform,
    public events: Events, public actionSheetCtrl: ActionSheetController)
  {

    //Get data from params pass from previous page with navCtrl
    this.testId =  this.navParams.get("testId");
    this.testTakenId = this.navParams.get("testTakenId");
    this.questions = this.navParams.get("questions");
    this.testTitle = this.navParams.get("testTitle");
    this.currentQuestion = this.navParams.get("currentQuestion");
    this.answers = this.navParams.get("answers");
    //Local staorage
    this.userToken = window.localStorage.getItem('userToken');
    //gets photos
    this.createPhotos(this.questions[this.currentQuestion].imgArray);
    console.log("this.testId", this.testId)
    if(this.questions.length > 0) {
      this.loadProgress = 100 * this.currentQuestion  / this.questions.length;
    }
    this.checkViewLandscape();
    this.checkViewPortait();
  }
  
  ionViewDidEnter(){
   // this.app._setDisableScroll(true);
  }
  
  checkPlatform(){
   console.log("hello", this.platform.is('core'))
    //this.app._setDisableScroll(true);
    if( this.platform.is('core')) {
      this.app._setDisableScroll(true);
    }
    if( this.platform.is('android')){
      console.log('Platform = Android');
      this.app._setDisableScroll(true);
    }
  }
  
  
  
  //Actionsheet for image grade
  presentActionSheet(i) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Make your selection',
      buttons: [
        {
          text: 'Normal',
          handler: () => {
            this.heart[i] = 'Normal';
            console.log('Normal clicked');
          }
        },{
          text: 'Enlarged',
          handler: () => {
            this.heart[i] = 'Enlarged';
            console.log('Enlarged clicked');
          }
        },{
          text: 'Undetermined',
          handler: () => {
            this.heart[i] = 'Undetermined';
            console.log('Undetermined clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  
  //Actionsheet when 'Enlarged' is selected
  answerActionSheet(x) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Type on enlargement',
      buttons: [
        {
          text: 'Left Enlarged',
          handler: () => {
            this.selectAnswer(x);
            console.log('Left Enlarged clicked');
          }
        },{
          text: 'Generally Enlarged',
          handler: () => {
            this.selectAnswer(x);
            console.log('Generally Enlarged clicked');
          }
        },{
          text: 'Right Enlarged',
          handler: () => {
            this.selectAnswer(x);
            console.log('Right Enlarged clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  //Check View
  checkViewLandscape(){
    return this.platform.isLandscape();
  }

  //Check View
  checkViewPortait(){
    return this.platform.isPortrait();
  }

 //Select image to View
  selectImage(img, i) {
    this.viewPic = img;
    this.currentImg = img;
    console.log("hello img", img)
    this.imageIndex = i;
  }

  //Creates Modal on click of the main image.
  imageZoom(index) {
    this.imageIndex = index;
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
        url: `https://vrtoby.softbrew.com/api/ImageContainer/image-container/download/` + questionImages[i],
      });
    }
    this.viewPic = this.photos[0].url;
    console.log(this.photos);
  }
  
  //Alert if answer is incomplete
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Answer is incomplete',
      subTitle: "Please check to see if you've scored each image then re-submit." ,
      buttons: ['OK']
    });
    alert.present();
  }

  //Logs user out
  closeTest() {
    let confirm = this.alertCtrl.create({
      title: 'Exit the current test?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Exit',
          handler: () => {
            console.log('Agree clicked');
            this.navCtrl.setRoot(TabsPage);
          }
        }
      ]
    });
    confirm.present();
  }

  /*On click from user on answer button updates answer if one already exists for
  the user on this question or test or creates*/
  selectAnswer(answerPicked){
  
    this.answers[this.currentQuestion]=answerPicked
    let answerData ={
      "questionId": this.questions[this.currentQuestion].id,
      "answer": answerPicked,
      "testTakenId": this.testTakenId
    }
    this.testService.saveAnswer(answerData, this.userToken)
    .map(res => {
    // If request fails, throw an Error that will be caught
      if(res.status < 200 || res.status >= 300) {
        throw new Error('This request has failed ' + res.status);
      } else {
        // If everything went fine, return the response
        return res.json();
        }
    })
    .subscribe( res => {
      console.log("hellos", this.testId)
      nextQuestion(this.testId, this.testTitle, this.navCtrl, this.currentQuestion, this.questions, this.testTakenId, this.answers)
    }, err => {
        alert("Error Server Could Not Be Found. Try again Later.")
        console.log(err)
    })
  }
}

//handles what data to send to the next question if last question goes to TestResultsPage
let nextQuestion = function(testid, title, nav, pageNum, question, takenId, answer){
    //if last question go to TestResultsPage
    if( pageNum === question.length-1){
      nav.setRoot(TestResultsPage,
        { 
          "testId": testid,
          "answers": answer,
          "questions": question,
          "testTakenId": takenId,
          "testTitle": title
        })
        //Go to nexst question with the data given in navCtrl
    }else{
      ++pageNum
      nav.push( TestViewPage, {
        "testId": testid,
        "currentQuestion": pageNum,
        "questions": question,
        "testTakenId": takenId,
        "answers": answer,
        "testTitle": title
      })
    }
  }
