import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  baseUrl: string = "https://vr-toby-jbrownssf.c9users.io:8080/api/AppUsers/";

  constructor(
    public http: Http,
    public events: Events,
    public storage: Storage)
  {
    console.log('Hello UserService Provider');
  }

  login(UserData){
        return this.http.post(this.baseUrl + "login", UserData);
    }

  register(newUserData) {
      return this.http.post(this.baseUrl, newUserData);
  }

  logout(token){
      return this.http.post(this.baseUrl + "logout?access_token=" + token, {});
  }

  signup(username: string) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.events.publish('user:signup');
  };

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };



}
