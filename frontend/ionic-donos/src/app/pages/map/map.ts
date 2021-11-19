import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { register } from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {

  public map: Map;

  constructor(
    private menu: MenuController,
    public platform: Platform,
    private mediaObserver: MediaObserver
  ) { }

  ngAfterViewInit() {
    
    proj4.defs('EPSG:2180',
      '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    register(proj4);

    var myProjection = new Projection({
      code: 'EPSG:2180',
      extent: [120000.26, -7534.86,
        934796.39, 887948.56],

    });
  
    setTimeout(() => {
      this.map = new Map({
        view: new View({
          projection: myProjection,
          center: [361000.1344, 363000.9189],
          zoom: 7 //6.2,
        }),
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        target: 'map'
      })
    }, 500);


    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      // console.log(change);
       setTimeout(() => {
          this.map?.updateSize();
       }, 400); 

     });

  }

  openLayers() {
    console.log("open layers")
    this.menu.open("menuLayers")
  }
}




