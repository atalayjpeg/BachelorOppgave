interface LayerConfig {
    id: string;
    legendUrl: string;
    tileUrl: string;
    setter: (url: string) => void;
    show: boolean;
  }
  
  const layerConfigurations = (
    showRadonLayer: boolean,
    showBedrock: boolean,
    showLosMasser: boolean,
    setRadonLegendUrl: (url: string) => void,
    setBedrockLegendUrl: (url: string) => void,
    setLosmasserLegendUrl: (url: string) => void
  ): { [key: string]: LayerConfig } => ({
    radon: {
      id: 'wms-radon-map-layer',
      legendUrl: 'https://geo.ngu.no/mapserver/RadonWMS2?language=nor&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=RadonWMS2&format=image/png&STYLE=default',
      tileUrl: 'https://geo.ngu.no/mapserver/RadonWMS2?language=nor&version=1.3.0&service=WMS&request=GetMap&layers=Radon_aktsomhet_oversikt&styles=&format=image/png&transparent=true&CRS=EPSG:3857&width=256&height=256&bbox={bbox-epsg-3857}',
      setter: setRadonLegendUrl,
      show: showRadonLayer,
    },
    bedrock: {
      id: 'ngu-berggrunnwms',
      legendUrl: 'https://geo.ngu.no/mapserver/BerggrunnWMS3?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetLegendGraphic&LAYER=Berggrunn_nasjonal&FORMAT=image/png&SLD_VERSION=1.1.0',
      tileUrl: 'https://geo.ngu.no/mapserver/BerggrunnWMS3?service=WMS&request=GetMap&layers=Berggrunn_nasjonal&styles=&format=image/png&transparent=true&version=1.3.0&CRS=EPSG:3857&width=800&height=600&bbox={bbox-epsg-3857}',
      setter: setBedrockLegendUrl,
      show: showBedrock,
    },
    losmasser: {
      id: 'ngu-losmasser',
      legendUrl: 'https://geo.ngu.no/mapserver/LosmasserWMS2?language=nor&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=Losmasse_Norge&format=image/png&STYLE=default',
      tileUrl: 'https://geo.ngu.no/mapserver/LosmasserWMS2?service=WMS&request=GetMap&version=1.3.0&layers=Losmasseflate_N1000_web&styles=&format=image/png&transparent=true&crs=EPSG:3857&width=800&height=600&bbox={bbox-epsg-3857}',
      setter: setLosmasserLegendUrl,
      show: showLosMasser,
    },
  });
  
  export type { LayerConfig };
  export { layerConfigurations };
  