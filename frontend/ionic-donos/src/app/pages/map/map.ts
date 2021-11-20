import { Component, ElementRef, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { register } from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';

import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';

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
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import Overlay from 'ol/Overlay';
import { ReportDetailsModal } from './report-details-modal /report-details-modal';
import { LayerMapParams, WmsLayers, WmsLayersLegend } from '../../const/BaseLayers';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit, OnDestroy {

  map: any;
  addReportModal: any;
  addReportMode = false;
  isPointSelected = false;
  currentCoords = [0, 0];
  WMS_LAYERS_NAME = 'wmsLayers'
  zIndex = 1



  public POINT_LAYER: any;
  coordinatesOnClickEvent: (evt: any) => void;
  selectInteraction: any;
  popupOverlay: any;
  legendLayers = WmsLayersLegend
  wmsLayers = WmsLayers

  @ViewChild('popup')
  popupElem!: ElementRef;

  @ViewChild('popupContent')
  popupContent!: ElementRef;

  constructor(
    private menu: MenuController,
    private modalController: ModalController,
    public platform: Platform,
    private mediaObserver: MediaObserver,
    private httpService: HttpService
  ) { }

  ngAfterViewInit() {
    
    proj4.defs("EPSG:2180", "+axis=neu +proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

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

      this.popupOverlay = new Overlay({
        element: this.popupElem.nativeElement,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });

      this.map.addOverlay(this.popupOverlay)

      if (WmsLayers.length === 0){
        this.initializeWmsLayers()
      }

      this.activateLayerFeatureSelection()

      this.getSpots()
    }, 500);


    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      // console.log(change);
      setTimeout(() => {
        this.map?.updateSize();
      }, 400);

    });
  }

  ngOnDestroy() {
  
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

  addReport() {
    this.addReportMode = true;
    this.activateCoordinatesOnClick()
    this.deactivateLayerFeatureSelection()
  }

  confirmAddReport() {
    this.presentReportModal()
    this.isPointSelected = false;

  }

  cancelAddReport() {
    this.addReportMode = false;
    this.isPointSelected = false;

    this.deactivateCoordinatesOnClick()
    this.activateLayerFeatureSelection()
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

  activateLayerFeatureSelection() {
    this.selectInteraction = new Select({
      condition: click,
    });
    this.map.addInteraction(this.selectInteraction);
    this.selectInteraction.on('select', (e: any) => {
      if (e.selected.length !== 0) {
        let coords = e.selected[0].values_.geometry.flatCoordinates
        console.log(coords)
        //this.popupContent.nativeElement.innerHTML = '<p>You clicked here:</p><code>' + '</code>';
        this.popupOverlay.setPosition(coords);
      } else {
        this.popupOverlay.setPosition(undefined)
      }

      //this.isLayerFeatureSelectable = (e.selected.length !== 0) ? true : false
    });
  }

  deactivateLayerFeatureSelection() {
    if (this.selectInteraction) {
      this.map.removeInteraction(this.selectInteraction)
    }
  }

  onChangeFileInput() {

  }

  onClickFileInputButton() {

  }

  showReportDetails() {
    this.presentReportModal()
  }

  async presentReportModal() {
    const modal = await this.modalController.create({
      component: ReportModal,
      cssClass: "report-modal",
      componentProps: {

      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.role === "ok") {
        this.addReportPoint(this.currentCoords as [number, number])
        this.cancelAddReport()
      } else if (dataReturned.role === "cancel") {
        this.cancelAddReport()
      }
    })

    return await modal.present();
  }

  async presentReportDetailsModal() {
    const modal = await this.modalController.create({
      component: ReportDetailsModal,
      cssClass: "report-modal",
      componentProps: {

      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.role === "ok") {

      } else if (dataReturned.role === "cancel") {

      }
    })

    return await modal.present();
  }


  /* WMS */

  initializeWmsLayers() {
    

    this.addWmsLayer('https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow', { name: "EGIB", wmsName: "obreby,geoportal,uzytki,dzialki,numery_dzialek,budynki,kontury", visible: false, version: "1.1.0" })
    this.addWmsLayer('https://wody.isok.gov.pl/gpservices/KZGW/MRP20_SkutkiZycieZdrowiePotencjalneStraty_WysokiePrawdopodPowodzi/MapServer/WMSServer', { name: "Obszary szczelnego ryzyka", wmsName: "4", visible: false, version: "1.1.1" })
    this.addWmsLayer('https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaUzbrojeniaTerenu', { name: "Uzbrojenia", wmsName: "przewod_pozostale,przewod_naftowy,przewod_elektroenergetyczny,przewod_telekomunikacyjny,przewod_gazowy,przewod_cieplowniczy,przewod_kanalizacyjny,przewod_wodociagowy,przewod_urzadzenia,przewod_slupy,przewod_inny,przewod_benzynowy", visible: false, version: "1.3.0" })
    this.addWmsLayer('https://wody.isok.gov.pl/gpservices/KZGW/MRP20_SkutkiZycieZdrowiePotencjalneStraty_WysokiePrawdopodPowodzi/MapServer/WMSServer', { name: "Ryzyko powodziowe", wmsName: "1", visible: false, version: "1.1.1" })
    this.addWmsLayer('https://mapy.geoportal.gov.pl/wss/ext/KrajowaIntegracjaMiejscowychPlanowZagospodarowaniaPrzestrzennego', { name: "MPZP", wmsName: "plany,raster,wektor-str,wektor-lzb,wektor-pow,wektor-lin,wektor-pkt,granice", visible: false, version: "1.1.0" })
    this.addWmtsLayer()

    let wmsLayerGroup = new LayerGroup({
      layers: this.wmsLayers
    })
    wmsLayerGroup.setProperties({
      layerName: this.WMS_LAYERS_NAME
    })

    console.log(wmsLayerGroup)
    this.map.addLayer(wmsLayerGroup)
  }

  addWmsLayer(url: string, layerParams: LayerMapParams) {
    var newLayer = new ImageLayer({
      source: new ImageWMS({
        url: url,
        params: {
          'FORMAT': "image/png",
          'VERSION': layerParams.version,
          "LAYERS": layerParams.wmsName,
          "CRS": "EPSG:2180"
        }
      }),
      visible: layerParams.visible,
      zIndex: ++this.zIndex

    })
    newLayer.setProperties({
      'layerName': layerParams.name
    })
    this.wmsLayers.push(newLayer)

    this.legendLayers.push({
      name: layerParams.name,
      checked: layerParams.visible,
      zIndex: this.zIndex,
      wmsLayersIndex: this.wmsLayers.length - 1,
    })
  }

  addWmtsLayer() {
    var parser = new WMTSCapabilities();
    fetch('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/HighResolution?SERVICE=WMTS&REQUEST=getcapabilities').then(response => {
      return response.text();
    }).then(text => {
      var result = parser.read(text);
      var options = optionsFromCapabilities(result, {
        layer: "ORTOFOTOMAPA",
        matrixSet: 'EPSG:2180',
        style: 'default',
      });
      if (options) {
        options.urls[0] = options.urls[0].replace('http:', 'https:');
        var mySource = new WMTS(options);
        var myLayer = new TileLayer({
          source: mySource,
          preload: Infinity,
        })
        myLayer.setZIndex(0)
        //this.map.addLayer(myLayer)
        //WmsLayers.push(myLayer)
        //WmsLayersLegend.push()           
      }
    });
  }

  layerStatusChanged(layer: any) {
    layer.checked = !layer.checked

    this.wmsLayers[layer.wmsLayersIndex]['values_']['visible'] = layer.checked
    this.map.updateSize()
  }

  getSpots() {
    this.httpService.getSpots().subscribe(
      results => {
        console.log(results)
      },
      error => {
        console.error
      })
  }
}




