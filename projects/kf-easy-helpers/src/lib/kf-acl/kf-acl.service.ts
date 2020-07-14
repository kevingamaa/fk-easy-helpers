import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class KfAclService {
    public readonly roles: BehaviorSubject<any> = new BehaviorSubject({});
    public readonly permissions: BehaviorSubject<any> = new BehaviorSubject({});
    public readonly ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
    constructor() { }

    private set globalPermissions(newPermissions: any[]) {
        let permissions: any = {};
        newPermissions.forEach((value: any) => {
            switch (typeof value) {
                case 'string':
                    permissions[value] = true;
                    break;
                case 'object':
                    permissions[value.name] = true;
                    break;
            }
        })

        this.permissions.next(permissions);
    }


    private set globalRoles(newRoles: any[]) {
        let roles: any = {};
        newRoles.forEach((role) => {
            switch (typeof role) {
                case 'string':
                    roles[role] = true;
                    break;
                case 'object':
                    roles[role.name] = true;
                    break;
            }
        });
        this.roles.next(roles);
    }
    public init(options: { name: string, permissions?: any[], roles?: any[] } | any) {
        if(options.permissions) {
            this.globalPermissions =   options.permissions;
        }
        if(options.roles) {
            this.globalRoles =   options.roles;
        }
        this.ready.next(true);
    }
    public can(name: string = '') {
        return this.permissions.getValue()[name] ? true : false;
    }

    public hasRole(role: any[] | string) {
        let can = false;
        let roles: any = this.roles.getValue();
        switch (typeof role) {
            case 'string':
                can = roles[role]? true: false;
                break;
            default:
                for(let r of role) {
                    if(roles[r]) {
                        can = true;
                        break;
                    }
                }
                break;
        }
        return can;
        
    } 
}


