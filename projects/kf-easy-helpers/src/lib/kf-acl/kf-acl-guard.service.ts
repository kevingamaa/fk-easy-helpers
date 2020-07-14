import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KfAclService } from './kf-acl.service';

@Injectable({
    providedIn: 'root'
})
export class KfAclGuardService implements CanActivate {

    constructor(
        private acl: KfAclService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
        let can = false;
        if(route.data.can) {
            can = this.acl.can(route.data.can);
        } else if (route.data.role) {
            can = this.acl.hasRole(route.data.role);
        }
        return can;
    }

}
