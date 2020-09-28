import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export type AclSecurity = {redirect_url: BehaviorSubject<string>};
@Injectable({
    providedIn: 'root'
})
export class KfAclService {
    public readonly roles: BehaviorSubject<any> = new BehaviorSubject({});
    public readonly permissions: BehaviorSubject<any> = new BehaviorSubject({});
    public readonly superRoles: BehaviorSubject<any> = new BehaviorSubject({});
    public readonly ready: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly security: AclSecurity = {
        redirect_url:  new BehaviorSubject<string>('/dash')
    };

    public  readonly isSuperRole: BehaviorSubject<boolean> = new BehaviorSubject(false);
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
    public init(options: { name?: string, permissions?: any[], roles?: any[] }, security: { redirect_url?: string } = {}) {
        if (options.permissions) {
            this.globalPermissions = options.permissions;
        }
        if (options.roles) {
            this.globalRoles = options.roles;
        }

        for(let i in security) {
            this.security[i].next(security[i]);
        }



        let superRoles = this.superRoles.getValue();
        let roles = this.roles.getValue();
        for(let i in roles) {
            if(superRoles[i]) {
                this.isSuperRole.next(true)
                break;
            }
        }

        this.ready.next(true);
    }


    public can(name: string = '') {
        return (this.permissions.getValue()[name] ? true : false)  || this.isSuperRole.getValue();
    }

    public hasRole(role: any[] | string) {
        let can = false;
        let roles: any = this.roles.getValue();
        switch (typeof role) {
            case 'string':
                can = roles[role] ? true : false;
                break;
            default:
                for (let r of role) {
                    if (roles[r]) {
                        can = true;
                        break;
                    }
                }
                break;
        }
        return can || this.isSuperRole.getValue();

    }


    public superRole(role: string | string[] = []) {
        if (typeof role == 'string') {
            role = [role];
        }

        let superRoles: any = {};

        for (let r of role) {
            superRoles[r] = true;
        }
        this.superRoles.next(superRoles);
        return this;
    }
}


