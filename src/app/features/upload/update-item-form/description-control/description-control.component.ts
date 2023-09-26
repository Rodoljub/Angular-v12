import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { FormErrorStateMatcher } from 'src/app/features/common/FormErrorStateMatcher';
import { config } from 'src/config/config';

@Component({
    selector: 'app-description-control',
    templateUrl: './description-control.component.html',
    styleUrls: ['description-control.component.scss']
})

export class DescriptionControlComponent implements OnInit {
    @Input() descriptionValue = '';
    @Output() value = new EventEmitter<string>();
    descriptionControl: FormControl;
    formErrorStateMatcher = new FormErrorStateMatcher();
    descriptionControlErrorMessage = '';
    descriptionMaxCharacters = config.descriptionMaxCharacters;

    constructor() {
        
     }

    ngOnInit() {

        this.descriptionControl = new FormControl(
            this.descriptionValue,
            [ 
                Validators.maxLength(config.descriptionMaxCharacters)
            ]
        )
        
        this.descriptionControl
        .valueChanges
        .pipe(
            debounceTime(300),
            tap(value => {
                this.value.emit(value);
            })
        )
        .subscribe(val => {
            this.value.emit(val);
        })
    }
}