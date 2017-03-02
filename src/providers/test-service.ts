import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TestService {
  questions: any;
  tests: any[] = [];
  baseUrl = "https://vrtoby.softbrew.com/api/";

  constructor(public http: Http) {
    console.log('Hello Tests Provider');
  }

  // Gets all test from our server
  getTests(token){
    return this.http.get(this.baseUrl + "Tests?" +
    "filter[include]=questionIds" + "&access_token=" +
    token ,  true)
  }
  
  // Gets specific test by id
    getSpecificTest( testId, token){
    return this.http.get(this.baseUrl + 
    "Tests?filter[include]=questionIds&filter[where][id]=" + 
    testId +
    "&access_token=" + 
    token)
  }
  
   // Find unfinished tests
  // getUnfinishedTests( token ){
  //   return this.http.get(this.baseUrl + 
  //   "TestTaken?filter[include]=userAnswerIds&filter[where][totalCorrect]=99999&access_token=" +
  //   token)
  // }
  
  getUnfinishedTests( userid, token ){
    return this.http.get(this.baseUrl + 
    "TestTaken?filter[include]=userAnswerIds&filter[where][totalCorrect]=99999" +
    "&filter[where][userId]=" + userid + "&access_token=" + token)
  }
  

  /*On test click from home page creates a testTaken in the backend which belongs to the user
    used to track current tests not finished
  */
  createUserTest(testData, token){
    return this.http.post(this.baseUrl + "TestTaken?access_token=" + token, testData);
  }

  reviewTest(id ,token){
    return this.http.get(this.baseUrl + "TestTaken/" + id + "?access_token=" + token);
  }

  /*  Saves answer if it is new, it creates new record and if one exists with same
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

      /*
      ?filter[where][id]=58b5d33173c791ec6869f6b2
      &filter[where][userId]=589a35703d25708c457bfd9c
      &access_token=kXRtX6CuKUHA6sJHEXPjMrAqv3O7pPFrlIIHLCwxbhHYZbswc9NQQ43L8CAIqAh2
      // */
  completeTest( testData, token ){
    console.log("testData from provider", testData);
    return this.http.post( this.baseUrl + "TestTaken/upsertWithWhere" +
      "?[where][id]="+ testData.id +
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


}
