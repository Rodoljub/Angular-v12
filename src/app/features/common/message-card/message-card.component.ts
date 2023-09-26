import { Component, OnInit, Input } from '@angular/core';
import { Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html'
})
export class MessageCardComponent implements OnInit {

  @Input() messageCard = false;
  @Input() messageTitle = '';
  @Input() messageContent = '';
  @Input() messageActionLable = '';
  @Input() route = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  messageAction() {
    this.router.navigate([this.route])
  }

}
