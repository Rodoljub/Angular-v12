import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { config } from '../../../../../config/config';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from '../../../../services/rs/comment.service';
import { CommentViewModel } from '../../../comments/CommentViewModel';
import { FormErrorStateMatcher } from '../../FormErrorStateMatcher';
import { FormControlModel } from '../../../../shared/FormControlModel';

@Component({
    selector: 'app-edit-comment-dialog',
    templateUrl: 'edit-comment-dialog.component.html'
})

export class EditCommentDialogComponent implements OnInit {
    @Input() comment: CommentViewModel;
    editCommentTitle = config.labels.dialogMenu.editComment;
    commentMax = config.commentMaxCharacter;
    editCommentForm: FormGroup;
    editCommentControl: AbstractControl;
    formErrorStateMatcher = new FormErrorStateMatcher();
    formControlModel: FormControlModel;
    @Output() cancelClick = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private commentService: CommentService
    ) { }

    get formControls() {
        this.editCommentControl = this.editCommentForm.get('editCommentControl');

        return this.editCommentControl;
    }

    ngOnInit() {
        this.createForm();
     }

    createForm() {
        this.editCommentForm = this.formBuilder.group({
          'editCommentControl': [
            this.comment.Content,
            [
              Validators.maxLength(config.commentMaxCharacter),
            ]
          ]
        })
      }

    onClickCancel() { this.cancelClick.emit(); }

    onClickAction() {
        this.comment.Content = this.editCommentControl.value;

        this.commentService.updateComment(this.comment)
            .then(response => {

            })
            .catch(error => {})
    }
}
