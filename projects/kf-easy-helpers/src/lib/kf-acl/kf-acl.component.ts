import { Component, OnInit, Input } from '@angular/core';
import { KfAclService } from './kf-acl.service';

@Component({
  selector: 'kf-acl-can',
  template: `
  <ng-container *ngIf="(aclService.permissions | async)[name] || (aclService.isSuperRole | async) ">
    <ng-content>

    </ng-content>
  </ng-container>
  `,
})
export class KfAclComponent implements OnInit {
  @Input() public name: string = ''; 
  constructor(
    public aclService: KfAclService
  ) { }

  ngOnInit() {
   
  }

}
