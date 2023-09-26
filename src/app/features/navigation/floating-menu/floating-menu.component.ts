import { Component, OnInit, Input, HostListener, Renderer2 } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { config } from '../../../../config/config';
import { menuFloatingAnimation } from '../../../animation/animation';
import { UserProfileModel } from '../../accounts/models/UserProfileModel';

@Component({
    selector: 'app-floating-menu',
    templateUrl: './floating-menu.component.html',
    animations: [
      menuFloatingAnimation
    ]
})
export class FloatingMenuComponent implements OnInit {
    @Input() userAuthenticated: boolean;
    menuButtonTooltip = config.tooltips.profile
    buttonTooltipClass = ['search-action-bar-margin-tooltip'];
    buttonTooltipPosition: TooltipPosition = 'above';
    isMatMenuOpen = false;
    menuIcon = 'sidenav';

    scrollTopDocument = 0;

    menuFloatingAnimationState = 'in';

    constructor(
      private renderer2: Renderer2
    ) { }

    @HostListener('window:scroll', ['$event'])
    onScroll(event) {

      let scrollTop = document.scrollingElement.scrollTop;
      if (scrollTop > this.scrollTopDocument) {
        this.menuFloatingAnimationState = 'out';
      }
      if (scrollTop + 100 < this.scrollTopDocument) {
        this.menuFloatingAnimationState = 'in';
      }

      this.scrollTopDocument = scrollTop;
    }

    ngOnInit(): void { }

    toggleMenu() {
        if (this.isMatMenuOpen) {
          this.renderer2.removeClass(document.body, 'noScroll')
          this.isMatMenuOpen = false;
          this.menuIcon = 'sidenav'
        } else {
          this.renderer2.addClass(document.body, 'noScroll')
          this.isMatMenuOpen = true;
          this.menuIcon = 'closeSearch'
        }
    }

    closeMenu() {
        this.isMatMenuOpen = false;
        this.renderer2.removeClass(document.body, 'noScroll')
        this.menuIcon = 'sidenav'
    }
}
