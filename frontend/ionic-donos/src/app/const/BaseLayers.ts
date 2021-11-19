import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import SourceOsm from 'ol/source/OSM';

export const BaseLayers: Layer[] = [
    new TileLayer({
      zIndex: 0,
      source: new SourceOsm({
        url: "https://lat-stage-maps.fream.pl/styles/klokantech-basic/{z}/{x}/{y}.png"
      })
    }),
  ]
  
  export const WmsLayers: Layer[] = []
  
  
  export const ExtendedLayers: any[] = []