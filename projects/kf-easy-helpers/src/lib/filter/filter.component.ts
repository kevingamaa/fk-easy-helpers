import { Component, OnInit, Input, Output, EventEmitter,  ViewChild  } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { distinct, debounceTime } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
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
    @Input() public orWhere: string[] = [];
    @Input() public whereIn: string[] = [];
    @Input() public whereInNot: string[] = [];

    @Input() public privateParams: string[] = [];

    @Input() public operator: any = {};
    @Input() public rename: any = {};
    @Input() public ilike: any = {};
    @Input() public like: any = {};
    @Input() public range: any[] = [];
    @Input() public number: any[] = [];

    @Input() public loading: boolean;
    @Input() public id: string | number;

    @Output() public filteredResult: EventEmitter<any> = new EventEmitter<any>();
    @Output() public initFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() public submit: EventEmitter<any> = new EventEmitter<any>();
   
    @ViewChild('form-body', { static: true }) public formFilter: any ;

    private allParams: string[] = [];
    constructor(
        public helper: HelperService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.allParams = [
            ...this.where,
            ...this.whereIn,
            ...this.whereInNot,
            ...this.orWhere,
        ]
        if (typeof this.form === 'undefined') {
            console.warn('Declare o form e passe como atributo! Ex: <app-filter [form]="YourForm">');
        } else {
            // this.formChanges();
            if (this.triggerType === 'timer') {
                this.timerTrigger();
            }

            // let params: any = this.getParams(this.route.snapshot.params);

            // if(Object.keys(params).length > 0) {
            //     this.form.patchValue(params)
            //     this.emitEvent(false);
            // }
        }
    }

   
    public exists(val, attr: 'where' | 'whereIn' | 'whereInNot' | 'orWhere' = 'where') {
        return this[attr].indexOf(val) > -1 ;
    }
    public timerTrigger() {
        this.form.valueChanges.pipe(
            distinct(),
            debounceTime(this.timer)
        ).subscribe(() => {
            // console.log(this.form.value, 'acabou 2019-08-25 02:32:29' )
            if(this.form.valid && !this.helper.isLoading) {
                this.emitEvent();
            }
        });

    }

    public getParams(form?) {

        let data: any = {};
        for(let i in form) {
            if(this.privateParams.indexOf(i) === -1 && this.allParams.indexOf(i) > -1 ) {
                data[i] =  this.form.value[i];
            }   
        }
        delete(data.where);
        delete(data.whereIn);
        delete(data.whereInNot);
        delete(data.orWhere);
        return data;
    }
    public emitEvent(emitsRoute = true) {
        let form = this.form.value;
        form = this.format(form);
        form = this.prepareWhere(form);

        // if(emitsRoute) {
        //     this.router.navigate([], {
        //         relativeTo: this.route,
        //         queryParamsHandling: 'merge',
        //         queryParams: this.getParams(this.form.value),
        //         // do not trigger navigation
        //         skipLocationChange: false
        //     });
        // }
      
        if(this.form.valid && !this.helper.isLoading) {
            this.filteredResult.emit(form);
            this.submit.emit({
                values: form,
                ...this
            });
        }
    }

    public prepareWhere(form: any) {

        
        if(this.where.length) {
            form.where = [];
        }
        if(this.whereIn.length) {
            form.whereIn = [];
        }
        if(this.whereInNot.length) {
            form.whereInNot = [];
        }
        if(this.orWhere.length) {
            form.orWhere = [];
        }
        for (let i in form) {

            let filter: any  = {name: i, operator: '=', value: form[i]};
            if (this.rename[i]) {
                filter.name = this.rename[i];
            }

            if(this.number.indexOf(i) > -1) {
                filter.value =  String(filter.value).replace(/\D/gim, '');
            }

            if ( (this.where.indexOf(i) > -1 || this.orWhere.indexOf(i) > -1) && form[i] ) {
                let func = this.where.indexOf(i) > -1? 'where': 'OrWhere';
                if(this.operator[i]) {
                    filter.operator = this.operator[i];
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
                    form[func].push([filter.name, '>=', this.helper.date(form[i].begin).format('Y-MM-DD HH:mm:ss') ]);
                    form[func].push([filter.name, '<=', this.helper.date(form[i].end).format('Y-MM-DD HH:mm:ss') ]);
                } else {
                    form[func].push([filter.name, filter.operator, filter.value]);
                }
            }


            if(this.whereIn.indexOf(i) > -1) {
                if(filter.value) {
                    form.whereIn.push([filter.name, filter.value]);
                }
            }

            if(this.whereInNot.indexOf(i) > -1) {
                if(filter.value) {
                    form.whereInNot.push([filter.name, filter.value]);
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
