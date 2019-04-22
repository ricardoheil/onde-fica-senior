import { Component, OnInit } from '@angular/core';
import { Unit } from '../unit';
import { UnitService } from '../unit.service';
import { SharedInfoService } from '../sharedinfo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  units: Unit[] = [];

  constructor(private unitService: UnitService,
              public sharedInfoService: SharedInfoService) { }

  ngOnInit() {
    this.sharedInfoService.setSearchBoxVisible(false);
    this.unitService.getUnits()
      .subscribe(units => this.units = units);
  }

  copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
