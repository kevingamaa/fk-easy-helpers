import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {getPtPaginatorIntl } from './paginatorConfig';
@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatTabsModule,
        MatCardModule,
        MatIconModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatListModule,
        MatRadioModule,
        MatTooltipModule,
        MatChipsModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getPtPaginatorIntl() }
    ]
})
export class MaterialModule { }
