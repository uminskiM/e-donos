import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import SourceOsm from 'ol/source/OSM';


export const BaseLayers: Layer[] = [
    new TileLayer({
      zIndex: 0,
      source: new SourceOsm()
    }),
  ]
  
  export const WmsLayers: Layer[] = []
  
  
  export const ExtendedLayers: any[] = []