import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { DateComponent } from '../components/date/date';

//  Providers
import { RestTests } from '../providers/rest-tests'; 
import { RestUser } from  '../providers/rest-user';
import { TabsService } from  '../providers/tabs-service';

// Image Plugin
import { GalleryModal } from 'ionic-gallery-modal';
import { ZoomableImage } from 'ionic-gallery-modal';
//  Pages
import { TestViewPage } from '../pages/test-view/test-view';
import { LandingPage } from '../pages/landing/landing';
import { SamplePage } from '../pages/sample/sample';
import { ResultsPage } from '../pages/results/results';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';
import { TestResultsPage } from '../pages/test-results/test-results';
import { QuestionsReviewPage } from '../pages/questions-review/questions-review';
import { TestReviewPage } from '../pages/test-review/test-review';

const injections = [
    MyApp,
    LandingPage,
    RegisterPage,
    ResultsPage,
    HomePage,
    TabsPage,
    GalleryModal,
    ZoomableImage,
    TestViewPage,
    ZoomableImage,
    SamplePage,
    TestResultsPage,
    QuestionsReviewPage,
    TestReviewPage 
    ]

@NgModule({
  declarations: [injections, ProgressBarComponent, DateComponent],
  imports: [
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          swipeBackEnabled: false
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: injections,
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
  RestTests, RestUser, TabsService
  ]
})
export class AppModule {}
