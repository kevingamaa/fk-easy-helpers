import { BreakpointObserver } from "@angular/cdk/layout";
import { Inject, Injectable, Optional } from "@angular/core";
import { Title } from "@angular/platform-browser";
import * as momentNamespace from "moment";
import { Moment } from "moment";
import { BehaviorSubject } from "rxjs";

import { KF_ENV } from "../kf-env-config";
import { KfEnvType } from "../kf-env-type";

export const moment =
  momentNamespace as unknown as typeof momentNamespace.default;

export type Loading = { id?: string };

@Injectable({
  providedIn: "root",
})
export class HelperService {
  public cssClasses: any = "";
  public isMobile = false;

  public loadingCtrl: any = {
    running: new BehaviorSubject<boolean>(false),
  };

  public toastOptions!: "ionic" | "ngx-toastr";

  constructor(
    public breakpointObserver: BreakpointObserver,
    public title: Title,
    @Optional() @Inject(KF_ENV) public env: KfEnvType,
  ) {
    let breakpoint = "760px";

    if (this.env?.breakpoints?.mobile) {
      breakpoint = this.env.breakpoints.mobile;
    }

    this.breakpointObserver
      .observe([`(min-width: ${breakpoint})`])
      .subscribe((state: any) => {
        this.isMobile = !state.matches;
      });
  }

  get isLoading(): boolean {
    return this.loadingCtrl.running.getValue();
  }

  public async loading(newLoading: Loading = {}) {
    this.loadingCtrl.options = newLoading;
    return setTimeout(() => this.loadingCtrl.running.next(true), 100);
  }

  public async stopLoading() {
    return setTimeout(() => this.loadingCtrl.running.next(false), 100);
  }

  public date(date: any = new Date()): Moment {
    return moment(date).parseZone().locale(window.navigator.language);
  }
}

export function strToCapitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function makeFormData(obj: any): FormData {
  const form = new FormData();

  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      form.append(i, obj[i]);
    }
  }

  return form;
}
