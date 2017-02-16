import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RestTests {
  questions: any;
 // private tests: any[] = [];
  tests: any[] = [];
 
  constructor(public http: Http) {
    console.log('Hello Tests Provider');
  }
  baseUrl = "http://ec2-52-32-39-215.us-west-2.compute.amazonaws.com/api/"
 
  // Gets all test from our server
  getTests(token){
    return this.http.get(this.baseUrl + "Tests?" + 
    "filter[include]=questionIds" + "&access_token=" + 
    token ,  true)
  }
  
  /*On test click from home page creates a testTaken in the backend which belongs to the user
    used to track current tests not finished
  */
  createUserTest(testData, token){
    return this.http.post(this.baseUrl + "TestTaken?access_token=" + token, testData)
  }
  
  //Gets all the questions and includes the testId to which test the questions belong too
  // getQuestions( testId, token){
  //   return this.http.get(this.baseUrl + "Questions?filter[where][testId]=" + testId + "&" + token,  true)
  // }
  
  reviewTest( id ,token){
    return this.http.get(this.baseUrl + "TestTaken/" + id + "?access_token=" + token)
  }
  
  /*    Saves answer if it is new, it creates new record and if one exists with same 
        testTakenId and questionId it will update that answer */
  saveAnswer(answerData, token){
    console.log("answerData: ", answerData)
    return this.http.post(this.baseUrl + "UserAnswers/upsertWithWhere?" +
    "[where][testTakenId]="+ answerData.testTakenId +
    "&[where][questionId]=" + answerData.questionId + 
    "&access_token=" + token, answerData)
  }
  
  getCompletedTests( id ,token ){
    return this.http.get(this.baseUrl + "AppUsers/" + 
      id + "/testTakenIds?filter[include][userAnswerIds]" + 
      "&access_token=" + token )
  }
  
 //customers?filter[include][reviews]=author&filter[where][age]=21
  questionTest(testId, token ){
  return this.http.get( this.baseUrl + "Questions/?filter[include]=userAnswerIds&filter[where][testTakenId]="
    + testId + "&access_token=" + token)
  }
  
  completeTest( testData, token ){
    return this.http.post(this.baseUrl + "TestTaken/upsertWithWhere?" +
      "[where][id]="+ testData.id +
      "&[where][userId]=" + testData.userId + 
      "&access_token=" + token, testData )
  }
  
  getUserAnswers( testId, token ){
    return this.http.get( this.baseUrl + "UserAnswers?filter[where][testTakenId]=" + testId + "&access_token=" + token)
  }
  
  getQuestions(testId, token ){
    return this.http.get( this.baseUrl + "Tests?filter[include][questionIds]&filter[where][id]=" + 
    testId + "&access_token=" + token)
  }

  // findUnfinishedTests(userId, token){
  //   return  return this.http.get( this.baseUrl + "TestTaken?filter[where][userId]=" +
  //     userId + "
  // }
  
  
}
