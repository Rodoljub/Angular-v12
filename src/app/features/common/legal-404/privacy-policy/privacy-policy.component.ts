import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styles: []
})
export class PrivacyPolicyComponent implements OnInit, AfterViewInit {

  loadPrivacy = false;
  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    this.loadPrivacy = true;
  }

}
