import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from '../services/helper.service';

@Component({
    selector: 'kf-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

    @Input() public loadingId: string;
    @Input() public color = 'primary';
    @Input() public running: boolean;
    @Input() public loadingType = 'progress-bar';
    @Input() public styles = '';
    @Input() public fullContent: boolean;
    @Input() public diameter: number = 80;
    @Input() public custom: boolean;
    @Input() public bgColor: string = '#00000070';
    @Input() public opacity: number = 1;
    @Input() public customStyle: any = {
        backgroundColor: '#00000070',
        opacity: 1
    };

    public classes: any = {};
    constructor(public helper: HelperService) { }
    ngOnInit() {
        if(this.custom) {
            this.loadingType = '';
        }
        if (this.styles) {
            this.styles.split(' ').forEach((val) => {
                this.classes[val] = true;
                if(val.includes('full-content')) {
                    this.classes['center-loading'] = true;
                    this.classes['align-center-loading'] = true;
                }
            });
        }
        if(this.fullContent) {
            this.classes['full-content'] = true;
        }
    }

}
