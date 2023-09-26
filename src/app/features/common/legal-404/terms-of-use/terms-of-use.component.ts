import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styles: []
})
export class TermsOfUseComponent implements OnInit, AfterViewInit {
  loadTerms = false;

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    this.loadTerms = true;
  }

}
