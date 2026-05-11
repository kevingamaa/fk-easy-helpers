import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { showUp } from "../app-animation";
import { HelperService } from "../services/helper.service";

@Component({
  selector: "kf-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  animations: [showUp],
})
export class FilterComponent implements OnInit {
  @Input() public form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() public timer = 3000;
  @Input() public triggerType: "button" | "timer" = "button";

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

  @Input() public loading = false;
  @Input() public id?: string | number;

  @Output() public filteredResult = new EventEmitter<any>();
  @Output() public initFilter = new EventEmitter<any>();
  @Output() public submit = new EventEmitter<any>();

  @ViewChild("form-body", { static: true }) public formFilter: any;

  private allParams: string[] = [];

  constructor(
    public helper: HelperService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.allParams = [
      ...this.where,
      ...this.whereIn,
      ...this.whereInNot,
      ...this.orWhere,
    ];

    if (!this.form) {
      console.warn(
        'Declare o form e passe como atributo! Ex: <kf-filter [form]="YourForm">',
      );
      return;
    }

    if (this.triggerType === "timer") {
      this.timerTrigger();
    }
  }

  public exists(
    val: string,
    attr: "where" | "whereIn" | "whereInNot" | "orWhere" = "where",
  ): boolean {
    return this[attr].indexOf(val) > -1;
  }

  public timerTrigger(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(this.timer))
      .subscribe(() => {
        if (this.form.valid && !this.helper.isLoading) {
          this.emitEvent();
        }
      });
  }

  public getParams(form: any = {}): any {
    const data: any = {};

    for (const i in form) {
      if (
        Object.prototype.hasOwnProperty.call(form, i) &&
        this.privateParams.indexOf(i) === -1 &&
        this.allParams.indexOf(i) > -1
      ) {
        data[i] = this.form.value[i];
      }
    }

    delete data.where;
    delete data.whereIn;
    delete data.whereInNot;
    delete data.orWhere;

    return data;
  }

  public emitEvent(emitsRoute = true): void {
    let form = { ...this.form.value };

    form = this.format(form);
    form = this.prepareWhere(form);

    if (this.form.valid && !this.helper.isLoading) {
      this.filteredResult.emit(form);
      this.submit.emit({
        values: form,
        ...this,
      });
    }
  }

  public prepareWhere(form: any): any {
    if (this.where.length) {
      form.where = [];
    }

    if (this.whereIn.length) {
      form.whereIn = [];
    }

    if (this.whereInNot.length) {
      form.whereInNot = [];
    }

    if (this.orWhere.length) {
      form.orWhere = [];
    }

    for (const i in form) {
      if (!Object.prototype.hasOwnProperty.call(form, i)) {
        continue;
      }

      const filter: any = {
        name: this.rename[i] || i,
        operator: "=",
        value: form[i],
      };

      if (this.number.indexOf(i) > -1) {
        filter.value = String(filter.value).replace(/\D/gim, "");
      }

      if (
        (this.where.indexOf(i) > -1 || this.orWhere.indexOf(i) > -1) &&
        form[i]
      ) {
        const func = this.where.indexOf(i) > -1 ? "where" : "orWhere";

        if (this.operator[i]) {
          filter.operator = this.operator[i];
        }

        if (this.ilike[i]) {
          const ilike = String(this.ilike[i]);
          filter.operator = "ilike";
          filter.value = `${ilike.length >= 1 ? "%" : ""}${filter.value}${ilike.length >= 2 ? "%" : ""}`;
        }

        if (this.like[i]) {
          const like = String(this.like[i]);
          filter.operator = "like";
          filter.value = `${like.length >= 1 ? "%" : ""}${filter.value}${like.length >= 2 ? "%" : ""}`;
        }

        if (this.range.indexOf(i) > -1) {
          form[func].push([
            filter.name,
            ">=",
            this.helper.date(form[i].begin).format("Y-MM-DD HH:mm:ss"),
          ]);
          form[func].push([
            filter.name,
            "<=",
            this.helper.date(form[i].end).format("Y-MM-DD HH:mm:ss"),
          ]);
        } else {
          form[func].push([filter.name, filter.operator, filter.value]);
        }
      }

      if (this.whereIn.indexOf(i) > -1 && filter.value) {
        form.whereIn.push([filter.name, filter.value]);
      }

      if (this.whereInNot.indexOf(i) > -1 && filter.value) {
        form.whereInNot.push([filter.name, filter.value]);
      }
    }

    return form;
  }

  public format(form: any): any {
    for (const i in form) {
      if (
        Object.prototype.hasOwnProperty.call(form, i) &&
        (moment.isDate(form[i]) || moment.isMoment(form[i]))
      ) {
        form[i] = this.helper.date(form[i]).format("Y-MM-DD");
      }
    }

    return form;
  }
}
