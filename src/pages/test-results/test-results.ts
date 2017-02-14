import { Component } from '@angular/core';
import { NavController, Nav, NavParams, App, Tabs } from 'ionic-angular';
// Providers
import { RestUser} from '../../providers/rest-user';
import { RestTests } from '../../providers/rest-tests';
import { TabsService } from '../../providers/tabs-service';
//Pages
import { HomePage } from '../home/home';


@Component({
  selector: 'page-test-results',
  templateUrl: 'test-results.html'
})
export class TestResultsPage {
tab:Tabs;
 
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
  
  constructor(public _navCtrl: NavController, public _navP: NavParams,
    public restUser: RestUser, public restTest: RestTests, private _app: App,
    private _nav: Nav, public tabs: TabsService) {
        
    // this.tab = this._navCtrl.parent;
  //   console.log("tab: ", this.tab)
    //Get data passed from previous page with navParams
    this.answers = this._navP.get("answers");
    this.testTitle = this._navP.get("testTitle");
    this.questions = this._navP.get("questions");
    this.testTakenId =  this._navP.get("testTakenId");
    this.totalQuestions = this.questions.length;
    this.userToken = window.localStorage.getItem('userToken');
    this.userId = window.localStorage.getItem('userId');
    
   //Compares user answers to the answers of the question
    for(var i = 0; i < this.totalQuestions; i++){
      this.questions[i].answerGiven = this.answers[i]
      if(this.questions[i].answer === this.answers[i]){
        this.correctNum++
      }else{
        this.wrongNum++
      }
    }
  
    let today = new Date();
    let completeTestData = 
      {
        "userId": this.userId,
        "createDate": today,
        "totalCorrect": this.correctNum,
        "totalCount": this.totalQuestions,
        "id": this.testTakenId
      };
     
     this.restTest.completeTest( completeTestData, this.userToken)
     .map( res => res.json())
      .subscribe( res => {
      }, err => {
        alert("Error")
        console.log(err)
      })
  }

  closeTestResult(){ console.log(this.tab)
  // this._app.setRootNav.setRoot(TabsPage, {tabIndex: 1});
    this._navCtrl.setRoot(HomePage);
    this.tabs.show()
  }
  

}
