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
  constructor(public helper: HelperService) { }
  ngOnInit() {
  }

}
