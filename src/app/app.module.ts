import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
import { ZoomableImage } from 'ionic-gallery-modal';
//Components
import { MyApp } from './app.component';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { Storage } from '@ionic/storage';
//Pages
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { QuestionsReviewPage } from '../pages/questions-review/questions-review';
import { RegisterPage } from '../pages/register/register';
import { ResultsPage } from '../pages/results/results';
import { SupportPage } from '../pages/support/support';
import { TabsPage } from '../pages/tabs/tabs';
import { TestResultsPage } from '../pages/test-results/test-results';
import { TestReviewPage } from '../pages/test-review/test-review';
import { TestViewPage } from '../pages/test-view/test-view';
import { TutorialPage } from '../pages/tutorial/tutorial';
//Services
import { UserService } from './../providers/user-service';
import { TestService } from './../providers/test-service';

const decs = [
  MyApp,
  AboutPage,
  AccountPage,
  ContactPage,
  GalleryModal,
  HomePage,
  LoginPage,
  QuestionsReviewPage,
  RegisterPage,
  ResultsPage,
  SupportPage,
  TabsPage,
  TestViewPage,
  TestResultsPage,
  TestReviewPage,
  TutorialPage,
  ZoomableImage
]

@NgModule({
  declarations: [
    decs,
    ProgressBarComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
    //, { scrollAssist: false, autoFocusAssist: false }
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    decs,
    GalleryModal
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService, TestService, Storage
    ]
})
export class AppModule {}
