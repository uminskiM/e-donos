import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {

  constructor(
    public platform: Platform,
    private mapService: MapService) {}

  ngAfterViewInit() {
    

    this.mapService.updateSize()
    this.mapService.refreshMap()


    let map;
  }
}




