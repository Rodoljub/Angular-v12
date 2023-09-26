import { Directive, HostListener, ElementRef, ContentChild, OnInit, Inject, Renderer2, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appHorizontalDragNDrop]'
})
export class HorizontalDragNDropDirective implements OnInit, AfterViewInit {

  @Input() paddingDraggable: number;
  movement: any;
  touchStartX: number;
  isMouseDown: boolean;
  touchPageY: any;
  touchStartY: number;
  touchMovex: number;
  draggable: any;
  container: any;
  @ContentChild('container', {static: false}) private containerElement: ElementRef;
  @ContentChild('draggable', {static: false}) private draggableElement: ElementRef;
  @ContentChild('tagElement', {static: false}) private tagElement: ElementRef;

  constructor(
    private renderer: Renderer2
  ) { }

  //#region HostListeners

  @HostListener('touchstart', ['$event'])
  onTouchStart(event) {
    this.renderer.removeAttribute(this.tagElement.nativeElement, ':hover')
    this.touchMovex = event.targetTouches[0].clientX;
    this.touchStartY = event.targetTouches[0].clientY;
    this.touchPageY = document.body.scrollTop;
    this.isMouseDown = true;

    if (this.container.clientWidth < this.draggable.clientWidth) {
      this.renderer.addClass(this.container, 'container-hover');
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event) {
    let touchemoveX = event.targetTouches[0].clientX;

    // const minMovmentX = 2
    // if (-minMovmentX > (this.touchMovex - touchemoveX) || (this.touchMovex - touchemoveX) > minMovmentX) {
    //   event.preventDefault();
    // }
    let touchMoveY = event.targetTouches[0].clientY;
    let movementX = touchemoveX - this.touchMovex;
    let movementY = touchMoveY - this.touchStartY;
    this.touchMovex = touchemoveX;
    this.moveTags(movementX, event);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event) {
    let touchEndX = event.changedTouches[0].clientX;
    if (this.touchStartX === touchEndX) {
      let isTag = event.srcElement.localName
        if (isTag === 'mat-chip') {
          let tag = event.srcElement.lastChild.nodeValue.trim();
          // this.selectTag(tag);
        }
    }
    this.renderer.removeClass(this.container, 'container-hover')
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown() {
    this.isMouseDown = true;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp() {
    this.isMouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.moveTags(event.movementX, event);
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut() {
    // this.isMouseDown = false;
  }

  //#endregion HostListeners

  ngOnInit() { }

  ngAfterViewInit() {
    this.container = this.containerElement.nativeElement;
    this.draggable = this.draggableElement.nativeElement;
  }

  moveTags(movementX: number, event) {

    const container = this.containerElement.nativeElement;
    const domRect = container.getBoundingClientRect();
    const draggable = this.draggable.getBoundingClientRect();

    if (
      event.clientX < domRect.left &&
      event.clientX > domRect.right &&
      event.clientY < domRect.top &&
      event.clientY > domRect.bottom
    ) {
      this.isMouseDown = false;
    }

    let diferent = 0;
    let left = domRect.left - draggable.left ;
    this.movement = draggable.left + movementX;
    let translate = movementX

    if (domRect.width < draggable.width + this.paddingDraggable) {
      diferent = draggable.width - domRect.width

      if (this.isMouseDown) {

        if (this.movement >= (domRect.left + this.paddingDraggable)) {
          translate = this.paddingDraggable;
        }

        if (this.movement < (domRect.left + this.paddingDraggable)) {

          translate = movementX - left;
        }

        if (this.movement < ( domRect.left - diferent - this.paddingDraggable)) {
          translate = -diferent - this.paddingDraggable;
        }

        this.renderer.setStyle(this.draggable, 'transform', 'translateX(' + (translate) + 'px)');
      }
    }
  }
}
