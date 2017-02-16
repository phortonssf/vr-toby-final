import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestsUser provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RestUser {
 baseUrl: string = "https://vr-toby-jbrownssf.c9users.io:8080/api/AppUsers/";
  constructor(public http: Http) {
    console.log('Hello RestsUser Provider');
  }
    
    login (UserData){
       return this.http.post( this.baseUrl + "login", UserData);
      }
    
    register(newUserData) {
        return this.http.post(this.baseUrl ,
        newUserData
        );
    }
  
    logout(token){
        return this.http.post(this.baseUrl + "logout?access_token=" +
        token,
        {}
        );
    }
}
