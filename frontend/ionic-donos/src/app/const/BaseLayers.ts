import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import SourceOsm from 'ol/source/OSM';


export const BaseLayers: Layer<any>[] = [
    new TileLayer({
      zIndex: 0,
      source: new SourceOsm()
    }),
  ]
  
  export const WmsLayers: Layer<any>[] = []
  
  export const WmsLayersLegend: LayerLegend[] = []


  export interface LayerMapParams {
    visible: boolean,
    name: string,
    wmsName: string,
    version: string
  }
  
  export interface LayerLegend {
    name: string,
    checked: boolean,
    zIndex: number,
    wmsLayersIndex: number,
  }