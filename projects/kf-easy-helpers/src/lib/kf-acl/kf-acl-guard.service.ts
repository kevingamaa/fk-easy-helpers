import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KfAclService } from './kf-acl.service';

@Injectable({
    providedIn: 'root'
})
export class KfAclGuardService implements CanActivate {

    constructor(
        private acl: KfAclService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
        let can = false;
        if(route.data.can) {
            can = this.acl.can(route.data.can);
        } else if (route.data.role) {
            can = this.acl.hasRole(route.data.role);
        }

        if(!can) {
            setTimeout(() =>  this.router.navigate([this.acl.security.redirect_url.getValue()]), 500);
        }
        return can;
    }

}
