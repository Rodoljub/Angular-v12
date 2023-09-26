import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {

  @Output() mouseHoverEvent = new EventEmitter<boolean>();
  timer
  itemInfo = false;

  constructor() { }

  @HostListener('mouseenter')
  onmouseenter() {
    this.mouseHoverEvent.emit(true);
  }

  @HostListener('mouseleave')
  onmouseleave() {
    this.mouseHoverEvent.emit(false);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event) {

    this.timer = setTimeout(() => {
      if (!this.itemInfo) {
        this.mouseHoverEvent.emit(true);
      } else {
        this.mouseHoverEvent.emit(false);
      }
      this.itemInfo = this.itemInfo ? false : true;
    }, 1000);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event) {
    clearTimeout(this.timer);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event) {
    clearTimeout(this.timer);
    // this.mouseHoverEvent.emit(false);
  }

}
