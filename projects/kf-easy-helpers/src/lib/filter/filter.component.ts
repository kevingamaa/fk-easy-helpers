import { Component, OnInit, Input, Output, EventEmitter,  ViewChild  } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { distinct, debounceTime } from 'rxjs/operators';

import { showUp } from '../app-animation';
import { HelperService } from '../services/helper.service';
import * as moment_ from 'moment';
const moment: any = moment_;
@Component({
    selector: 'kf-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    animations: [showUp]
})
export class FilterComponent implements OnInit {

    @Input() public form: FormGroup = new FormGroup({});
    @Input() public timer = 2000; // 1s
    @Input() public triggerType: 'button' | 'timer' = 'button';

    // conditions
    @Input() public where: string[] = [];
    @Input() public rename: any = {};
    @Input() public ilike: any = {};
    @Input() public like: any = {};
    @Input() public range: any = {};


    @Input() public loading: boolean;
    @Input() public id: string | number;

    @Output() public filteredResult: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('form-body', { static: true }) public formFilter: any ;
    constructor(
        public helper: HelperService
    ) { }

    ngOnInit() {
        if (typeof this.form === 'undefined') {
            console.warn('Declare o form e passe como atributo! Ex: <app-filter [form]="YourForm">');
        } else {
            // this.formChanges();
            if (this.triggerType === 'timer') {
                this.timerTrigger();
            }

        }
    }

    public timerTrigger() {
        this.form.valueChanges.pipe(
            distinct(),
            debounceTime(this.timer)
        ).subscribe(() => {
            // console.log(this.form.value, 'acabou 2019-08-25 02:32:29' )
            this.emitEvent();
        });

    }

    public emitEvent() {
        let form = this.form.value;
        form = this.format(form);
        form = this.prepareWhere(form);
        this.filteredResult.emit(form);
    }

    public prepareWhere(form: any) {
        form.where = [];
        for (const i in form) {
            if ( this.where.find((val: string) => val.includes(i)) ) {
                let filter: any  = {0: '', 1: '=', 2: ''};
                if (this.rename[i]) {
                    filter[0] = this.rename[i];
                }

                if(this.ilike[i]) {
                    let ilike = String(this.ilike[i]);
                    filter[0] = i;
                    filter[1] = 'ilike';
                    filter[2] = `${ilike.length == 1?'%': ''}${form[i]}${ilike.length == 2?'%': ''}`;
                }
                if(this.like[i]) {
                    let like = String(this.ilike[i]);
                    filter[0] = i;
                    filter[1] = 'ilike';
                    filter[2] = `${like.length == 1?'%': ''}${form[i]}${like.length == 2?'%': ''}`;
                }

                if(this.range[i]) {
                    filter.where.push([i, '>=', this.helper.date(form[i].begin).format('Y-M-DD HH:mm:ss') ]);
                    filter.where.push([i, '<=', this.helper.date(form[i].end).format('Y-M-DD HH:mm:ss') ]);
                } else {
                    form.where.push([filter[0], filter[1], form[i]]);
                }
            }
        }
        return form;
    }


 
    public format(form: any) {
        for (const i in form) {
            if (moment.isDate(form[i]) || moment.isMoment(form[i])) {
                form[i] = this.helper.date(form[i]).format('Y-MM-DD');
            }
        }
        return form;
    }



}
