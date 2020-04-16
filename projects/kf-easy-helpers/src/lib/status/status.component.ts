import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kf-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  @Input() public format: 'square' | 'pill' = 'square';
  @Input() public styles: string = 'default';
  @Input() public label: any;
  @Input() public text: string = 'none';
  @Input() public animation: string = '';
  constructor() { }

  ngOnInit() {
    if (typeof this.label == 'object') {
      this.text = this.label.name;
      this.styles = this.label.style;
    }

    this.styles = String(this.styles).toLowerCase();


  }
}
