import { Component, Input } from '@angular/core';


@Component({
  selector: 'date',
  templateUrl: 'date.html'
})
export class DateComponent {

  @Input('myDate') myDate;

  constructor() {
    console.log('Hello Date Component');
  }

}
