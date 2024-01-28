import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { LimitToPipe } from './pipes/limit-to.pipe';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { LayoutComponent } from './layout/layout.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DragAndDropDirective } from './file-upload/draganddrop.directive';

@NgModule({
    imports: [
        RouterModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
    ],
    declarations: [
        LimitToPipe,
        LocalDatePipe,
        YesNoPipe,
        LayoutComponent,
        FileUploadComponent,
        DragAndDropDirective,
        
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        CustomMaterialModule,
        LimitToPipe,
        LocalDatePipe,
        YesNoPipe,
        FileUploadComponent
    ]
})
export class SharedModule { }
