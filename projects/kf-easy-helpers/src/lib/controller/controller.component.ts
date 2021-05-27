import { MatTableDataSource } from '@angular/material/table';
import { Component } from '@angular/core';
import { HelperService } from '../services/helper.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'kf-controller',
    template: '',
  })
export class ControllerComponent {
    public element: BehaviorSubject<any> | any = new BehaviorSubject<any>([]);
    public displayedColumns: string[];
    public dataSource = new MatTableDataSource<any>([]);
    public filters: any = {};
    public requisition: any;
    public alertCtrl: any;

    constructor(public helper: HelperService) {
    }
    public applyFilter(filterValue: string) {

        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public joinFilter(params) {
        this.filters = {
            ...this.filters,
            ...params
        };
    }

    public killRequests() {
        if( this.requisition) {
            this.requisition.unsubscribe()
        }
    }
    async askPop(element, action = 'delete', options: any = { text: '' }) {
        const alert = await this.alertCtrl.create({
            header: 'Tem certeza?',
            message: options.text,
            buttons: [
                {
                    text: 'Não',
                    cssClass: 'medium',
                    handler: () => {

                    }
                },
                {
                    text: 'Sim',
                    cssClass: 'primary',
                    handler: () => {
                        if (this[action]) {
                            this[action](element);
                        }
                    }
                }
            ]
        });

        return await alert.present();
    }

    delete(element?) {

    }

    update(element?) {

    }

    updateDataTable(data) {
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
    }

}
