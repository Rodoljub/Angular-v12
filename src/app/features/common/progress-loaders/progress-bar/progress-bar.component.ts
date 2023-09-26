import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { config } from '../../../../../config/config';

@Component({
  selector: '[app-progress-bar]',
  templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent implements OnInit {

  @Input() progressBarType: string;

  progressBarClass = '';

  constructor() { }

  ngOnInit() {
    switch (this.progressBarType) {
      case config.progressBar.type.main:
        this.progressBarClass = 'progress-bar';
        break;
      case config.progressBar.type.accounts:
        this.progressBarClass = 'account-progress-bar';
        break;
      case config.progressBar.type.uploads:
        this.progressBarClass = 'uploads-progress-bar';
        break;
      default:
        break;
    }
  }
}
