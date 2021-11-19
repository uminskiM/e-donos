import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { register } from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';

import LayerGroup from 'ol/layer/Group';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { modalController } from '@ionic/core';
import { ReportModal } from './report-modal/report-modal';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {

  map: any;
  addReportModal: any;
  addReportMode = false;
  isPointSelected = false;
  currentCoords = [0, 0]

  public POINT_LAYER: any;
  coordinatesOnClickEvent: (evt: any) => void;

  constructor(
    private menu: MenuController,
    private modalController: ModalController,
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

  addPointLayer(coords: [number, number]) {
    this.map.removeLayer(this.POINT_LAYER)
    this.isPointSelected = true;
    
    var feature = new Feature(new Point(coords))
    var source = new VectorSource({
      features: [feature],
    });

    this.POINT_LAYER = new VectorLayer({
      source: source,
      //style: style,
      zIndex: 1005
    });


    this.POINT_LAYER.setStyle(new Style({
      image: new CircleStyle({
        radius: 8,
        stroke: new Stroke({
          color: '#8B0000',
        }),
        fill: new Fill({
          color: '#000',
        })
      })
    }));

    this.map.addLayer(this.POINT_LAYER)
  }

  addReportPoint(coords: [number, number]) {
    
    var feature = new Feature(new Point(coords))
    var source = new VectorSource({
      features: [feature],
    });

    var point = new VectorLayer({
      source: source,
      //style: style,
      zIndex: 1005
    });


    point.setStyle(new Style({
      image: new CircleStyle({
        radius: 8,
        stroke: new Stroke({
          color: '#6b7078',
        }),
        fill: new Fill({
          color: '#428af5',
        })
      })
    }));

    this.map.addLayer(point)
  }

  addReport(){
    this.addReportMode = true;
    this.activateCoordinatesOnClick() 
  }

  confirmAddReport(){
    this.presentReportModal()
    this.isPointSelected = false;

  }

  cancelAddReport(){
    this.addReportMode = false;
    this.isPointSelected = false;
    this.deactivateCoordinatesOnClick()
    this.map.removeLayer(this.POINT_LAYER)
  }

  activateCoordinatesOnClick() {
    this.map.on('singleclick', this.coordinatesOnClickEvent = (evt: any) => {
      this.currentCoords = evt.coordinate
      this.addPointLayer(evt.coordinate)
    })
  }

  deactivateCoordinatesOnClick() {
    if (this.coordinatesOnClickEvent) {
      this.map.un('singleclick', this.coordinatesOnClickEvent)
    }
  }

  onChangeFileInput(){

  }

  onClickFileInputButton(){

  }

  async presentReportModal() {
    const modal = await this.modalController.create({
      component: ReportModal,
      cssClass: "report-modal",
      componentProps: {

      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if(dataReturned.role === "ok") {
        this.addReportPoint(this.currentCoords as [number, number])
        this.cancelAddReport()
      } else if (dataReturned.role === "cancel") {
        this.cancelAddReport()
      }
    })

    return await modal.present();
  }

  
  
}




