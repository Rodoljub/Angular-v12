import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    UploadRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    // UploadComponent
  ],
  exports: [
  ]
})
export class UploadModule { }
