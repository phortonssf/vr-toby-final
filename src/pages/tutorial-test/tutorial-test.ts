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
  selector: 'page-tutorial-test',
  templateUrl: 'tutorial-test.html'
})
export class TutorialTestPage {

  private photos: any[] = [];
  testId: any;
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
  view:any;
  zoom: string = 'Zoom';
  select: string = 'None:';
  heart: any = ['None:', 'None:', 'None:'];

  constructor(public navCtrl: NavController, public modal: ModalController,
    public testService: TestService, public userService: UserService,
    public navParams: NavParams, public alertCtrl: AlertController,
    private app: App, public platform: Platform,
    public events: Events, public actionSheetCtrl: ActionSheetController)
  {

    
  }
  
  ionViewDidEnter(){
    this.app._setDisableScroll(true);
  }
  
  //Actionsheet
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
      nextQuestion(this.testTitle, this.navCtrl, this.currentQuestion, this.questions, this.testTakenId, this.answers)
    }, err => {
        alert("Error Server Could Not Be Found. Try again Later.")
        console.log(err)
    })
  }
}

//handles what data to send to the next question if last question goes to TestResultsPage
let nextQuestion = function(title,  nav, pageNum, question, takenId, answer){
    //if last question go to TestResultsPage
    if( pageNum === question.length-1){
      nav.setRoot(TestResultsPage,
        {
          "answers": answer,
          "questions": question,
          "testTakenId": takenId,
          "testTitle": title
        })
        //Go to nexst question with the data given in navCtrl
    }else{
      ++pageNum
      nav.push(TutorialTestPage, {
        "currentQuestion": pageNum,
        "questions": question,
        "testTakenId": takenId,
        "answers": answer,
        "testTitle": title
      })
    }
  }