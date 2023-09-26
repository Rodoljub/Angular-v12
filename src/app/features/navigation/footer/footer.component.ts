import { Component, OnInit, HostListener, ElementRef, PLATFORM_ID, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { EventService } from '../../../services/utility/event.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {

  footerHeight
  mainProgressSpinnerSubscription: Subscription;
  footerShow = true;
  isProgressSpinner = true;
  responsive: boolean;

  constructor(
    public el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private eventService: EventService,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private route: ActivatedRoute
  ) {



  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let eTIW = event.target.innerWidth
    this.resize(eTIW);
  }


  private resize(eTIW: any) {
    if (eTIW >= 961) {
      this.responsive = false;
    } else {
      this.responsive = true;
    }
  }

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {

      let clientWidth = this.document.scrollingElement.clientWidth;
      this.resize(clientWidth)
    }
  }

  ngAfterViewInit() {
  }

  navContact() {
    this.router.navigate([{outlets: {auth: 'accounts/contact'}}], {relativeTo: this.route});
  }
}
