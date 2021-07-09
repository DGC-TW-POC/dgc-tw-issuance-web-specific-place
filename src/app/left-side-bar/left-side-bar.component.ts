import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftSideBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }

}
