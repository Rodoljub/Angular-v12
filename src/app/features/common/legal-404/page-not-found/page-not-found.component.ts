import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../services/utility/event.service';
import { ProgressSpinnerModel } from '../../progress-loaders/progress-spinner/ProgressSpinnerModel';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {

  messageCard = true;
  messageTitle = '404 Not Found';
  messageContent = 'Sorry, an error has occured, Requested page not found!';
  messageActionLable = 'Take Me Home';
  route = '/';

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      let progressSpinnerModel = new ProgressSpinnerModel(false, false);
      this.eventService.setMainProgressSpinner(progressSpinnerModel);
    }, 0)

  }

}
