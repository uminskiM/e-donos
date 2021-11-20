import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultInteractions, Draw, PinchZoom, Select } from 'ol/interaction';
import { Injectable } from '@angular/core';
import { register } from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';
import VectorSource from 'ol/source/Vector';
import GeometryType from 'ol/geom/GeometryType';
import VectorLayer from 'ol/layer/Vector';
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import { Style, Stroke, Fill, RegularShape } from 'ol/style';

import { easeOut } from 'ol/easing';

import { unByKey } from 'ol/Observable';
import { getVectorContext } from 'ol/render';
import CircleStyle from 'ol/style/Circle';
import { click } from 'ol/events/condition';

import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';

import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import TileLayer from 'ol/layer/Tile';
import { BaseLayers } from '../const/BaseLayers';






@Injectable({
  providedIn: 'root'
})
export class MapService {

  map!: Map;

  isLayerFeatureSelectable = false;

  selectInteraction: any
  popupOverlay: any;
  popup: any;


  constructor() {
    this.setUpMap()
  }

  setUpMap() {
    let that = this
    proj4.defs('EPSG:2180',
      '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    register(proj4);

    var myProjection = new Projection({
      code: 'EPSG:2180',
      extent: [120000.26, -7534.86,
        934796.39, 887948.56],

    });
    this.map = new Map({
      layers: BaseLayers,
      view: new View({
        projection: myProjection,
        center: [361000.1344, 363000.9189],
        zoom: 7 //6.2,
      }),
      controls: [],
    });
    
   /* fetch('https://lat-stage-maps.fream.pl/services/wmts?service=WMTS&request=GetCapabilities')
      .then(function (response) {
        return response.text();
      })
      .then((text) => {
        const parser = new WMTSCapabilities();

        const result = parser.read(text);
        console.log(result)
        const options = optionsFromCapabilities(result, {
          layer: "klokantech-basic",
        });

        
        let lyr = new TileLayer({
          opacity: 1,
          source: new WMTS(options),
        })
        WmsLayers.push(lyr)
      });*/
     


  }

  setView(center: [number, number], zoom?: number) {
    var currentZoom = this.map.getView().getZoom()
    zoom = zoom === undefined ? currentZoom : zoom
    //var zoom = zoom === undefined ? currentZoom : zoom
    this.map.getView().setZoom(zoom!)
    this.map.getView().setCenter(center);
  }

  updateSize(target = 'map') {
    this.map.setTarget(target);
    this.map.updateSize();
  }

  panTo(center: [number, number], duration = 1000, zoom?: number) {
    zoom = zoom === undefined ? this.map.getView().getZoom() : zoom
    this.map.getView().animate({
      center: center,
      duration: duration,
      zoom: zoom
    })
  }

  zoomIn() {
    var view = this.map.getView()
    var zoom = view?.getZoom()!
    view.setZoom(zoom + 1)
  }

  zoomOut() {
    var view = this.map.getView()
    var zoom = view?.getZoom()!
    view.setZoom(zoom - 1)
  }

  refreshMap() {
    setTimeout(() => { this.map.updateSize(); }, 100);
  }

  
}

