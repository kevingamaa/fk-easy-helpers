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
    @Input() public timer = 3000; // 1s
    @Input() public triggerType: 'button' | 'timer' = 'button';

    // conditions
    @Input() public where: string[] = [];
    @Input() public operator: any = {};
    @Input() public rename: any = {};
    @Input() public ilike: any = {};
    @Input() public like: any = {};
    @Input() public range: any[] = [];
    @Input() public number: any[] = [];


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
        for (let i in form) {
            if ( this.where.indexOf(i) > -1 && form[i]  ) {
                let filter: any  = {name: i, operator: '=', value: form[i]};
                if (this.rename[i]) {
                    filter.name = this.rename[i];
                }

                if(this.operator[i]) {
                    filter.operator = this.operator[i];
                }

                if(this.number.indexOf(i) > -1) {
                    filter.value =  String(filter.value).replace(/\D/gim, '');
                }

                if(this.ilike[i]) {
                    let ilike = String(this.ilike[i]);
                    filter.operator = 'ilike';
                    filter.value = `${ilike.length >=  1?'%': ''}${filter.value}${ilike.length >= 2?'%': ''}`;
                }
                if(this.like[i]) {
                    let like = String(this.like[i]);
                    filter.operator = 'like';
                    filter.value = `${like.length >= 1?'%': ''}${filter.value}${like.length >=  2?'%': ''}`;
                }
                
                if(this.range.indexOf(i) > -1) {
                    form.where.push([filter.name, '>=', this.helper.date(form[i].begin).format('Y-MM-DD HH:mm:ss') ]);
                    form.where.push([filter.name, '<=', this.helper.date(form[i].end).format('Y-MM-DD HH:mm:ss') ]);
                } else {
                    form.where.push([filter.name, filter.operator, filter.value]);
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
