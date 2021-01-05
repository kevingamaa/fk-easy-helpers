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
    private toastCtrl: any;
    
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

            if(this.env.toastCtrl) {
                let toastClass = this.env.toastCtrl.class;
                this.toastCtrl = new toastClass();
            }
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

    async toast(message = { title: 'ok', text: '' }, options: any = 'success') {
        const optionsToSend: any = typeof options === 'string' ? {} : options;
        if (!optionsToSend.buttons) {
            optionsToSend.buttons = [
                {
                    text: 'Ok',
                    role: 'cancel'
                }
            ];
        }
        if (typeof options === 'string' || !optionsToSend.color) {
            optionsToSend.color = options ? options : 'primary';
            // console.log( optionsToSend.color);
        }

        if (!optionsToSend.position) {
            optionsToSend.position = 'top';
        }
        optionsToSend.header = message.title;
        optionsToSend.message = message.text;
        optionsToSend.duration = 5000;
        const toast = await this.toastCtrl.create(optionsToSend);
        toast.present();
    }

    public date(date: any = new Date()): Moment {
        return moment(date)
        .parseZone()
        .locale(window.navigator.language);
    }

    public encript(dados) {
        let mensx = '';
        let l;
        let i;
        let j = 0;
        const ch = 'assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm';
        for (i = 0; i < dados.length; i++) {
            j++;
            l = (this.asc(dados.substr(i, 1)) + (this.asc(ch.substr(j, 1))));
            if (j === 50) {
                j = 1;
            }
            if (l > 255) {
                l -= 256;
            }
            mensx += (this.chr(l));
        }
        return mensx;
    }

    public decript(dados) {
        let  mensx = '';
        let  l;
        let  i;
        let j = 0;
        const ch = 'assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm';
        for (i = 0; i < dados.length; i++) {
            j++;
            l = (this.asc(dados.substr(i, 1)) - (this.asc(ch.substr(j, 1))));
            if (j === 50) {
                j = 1;
            }
            if (l < 0) {
                l += 256;
            }
            mensx += (this.chr(l));
        }
        return mensx;
    }
    public asc(str) {
        return str.charCodeAt(0);
    }

    public chr(asciiNum) {
        return String.fromCharCode(asciiNum);
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