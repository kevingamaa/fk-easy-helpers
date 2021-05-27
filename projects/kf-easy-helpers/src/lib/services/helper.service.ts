import { Injectable, Inject, Optional } from '@angular/core';
import {  BehaviorSubject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import * as moment_ from 'moment';
import { KfEnvType } from '../kf-env-type';
import { KF_ENV } from '../kf-env-config';
import { Moment } from 'moment';
export const moment: any = moment_;


export type loading = {id?: string};
@Injectable({
    providedIn: 'root'
})
export class HelperService {
    public cssClasses: any = '';
    public isMobile: boolean;
    public loadingCtrl: any = {
        running: new BehaviorSubject(false)
    };
    public toastOptions: 'ionic' | 'ngx-toastr';
    
    constructor(
        public breakpointObserver: BreakpointObserver,
        public title: Title,
        @Optional() @Inject(KF_ENV) public env: KfEnvType
    ) {
        
        let breakpoint ='760px';

        if(this.env.breakpoints) {
            if(this.env.breakpoints.mobile) {
                breakpoint = this.env.breakpoints.mobile;
            }
        }
        this.breakpointObserver.observe([`(min-width: ${breakpoint})`])
            .subscribe((state: any) => {
                if (state.matches) {
                    this.isMobile = false;
                } else {
                    this.isMobile = true;
                }
            });
    }

    get isLoading() {
        return this.loadingCtrl.running.getValue();
    }
    public async loading(newLoading: loading = {}) {
        this.loadingCtrl.options = newLoading;
        return await setTimeout(async () => this.loadingCtrl.running.next(true), 100);
    }

    public async stopLoading() {
        return await setTimeout(async () => this.loadingCtrl.running.next(false), 100);
    }

    public date(date: any = new Date()): Moment {
        return moment(date)
        .parseZone()
        .locale(window.navigator.language);
    }
}



export function strToCapitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export function makeFormData(obj) {
    let form = new FormData();
    for(let i in obj) {
        form.append(i, obj[i]);
    }
    return form;
}