import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-comment-control',
  templateUrl: './comment-control.component.html',
  styleUrls: ['./comment-control.component.scss']
})
export class CommentControlComponent implements OnInit {

  @Output() value = new EventEmitter<boolean>();

  commentControl: FormControl;
  enable = false;

  constructor() { }

  ngOnInit(): void {

    this.commentControl = new FormControl(
      this.enable
    )

    this.commentControl.valueChanges
    .subscribe(value => {
      this.value.emit(value);
    })
  }



}
