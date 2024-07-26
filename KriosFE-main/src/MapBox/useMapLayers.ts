import { useEffect } from 'react';
import { Map } from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { clusterAllWeatherStations } from './clusterAllWeatherStations';
import { LayerConfig, layerConfigurations } from '../interface/ILayerConfig'; // Import here

interface UseMapLayersProps {
  mapInstance: Map | null;
  showRadonLayer: boolean;
  showBedrock: boolean;
  showLosMasser: boolean;
  showForesight: boolean;
  showStationMarker: boolean;
  weatherStations: Feature<Geometry, GeoJsonProperties>[];
  foresightData: any;
  setRadonLegendUrl: (url: string) => void;
  setBedrockLegendUrl: (url: string) => void;
  setLosmasserLegendUrl: (url: string) => void;
}

const useMapLayers = ({
  mapInstance,
  showRadonLayer,
  showBedrock,
  showLosMasser,
  showForesight,
  showStationMarker,
  weatherStations,
  foresightData,
  setRadonLegendUrl,
  setBedrockLegendUrl,
  setLosmasserLegendUrl,
}: UseMapLayersProps) => {
  const layers = layerConfigurations(
    showRadonLayer,
    showBedrock,
    showLosMasser,
    setRadonLegendUrl,
    setBedrockLegendUrl,
    setLosmasserLegendUrl
  );

  useEffect(() => {
    Object.keys(layers).forEach((key) => {
      const { show, legendUrl, setter } = layers[key];
      if (show) {
        setter(legendUrl);
      } else {
        setter('');
      }
    });

    if (mapInstance && showStationMarker) {
      if (!mapInstance.getSource('weatherStations')) {
        mapInstance.addSource('weatherStations', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: weatherStations,
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });
      }
    }

    if (mapInstance && !showStationMarker) {
      if (mapInstance.getSource('weatherStations')) {
        mapInstance.removeSource('weatherStations');
      }
    }
  }, [showRadonLayer, showBedrock, showLosMasser, showStationMarker]);

  useEffect(() => {
    if (mapInstance && mapInstance.getStyle()) {
      Object.keys(layers).forEach((key) => {
        const { id, tileUrl, show } = layers[key];
        if (mapInstance.getLayer(id)) {
          mapInstance.setLayoutProperty(id, 'visibility', show ? 'visible' : 'none');
        } else if (show) {
          mapInstance.addLayer({
            id,
            type: 'raster',
            source: {
              type: 'raster',
              tiles: [tileUrl],
              tileSize: 256,
            },
            paint: {},
          });
        }
      });

      if (mapInstance.getLayer('foresight-heatmap')) {
        mapInstance.setLayoutProperty('foresight-heatmap', 'visibility', showForesight ? 'visible' : 'none');
      } else if (showForesight && foresightData) {
        mapInstance.addSource('foresight', {
          type: 'geojson',
          data: foresightData,
        });
        mapInstance.addLayer({
          id: 'foresight-heatmap',
          type: 'heatmap',
          source: 'foresight',
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['/', ['get', 'precipitation'], 1000],
              0,
              0,
              1,
              1,
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              0.25,
              9,
              0.75,
              15,
              1.5,
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(255,255,255,0)',
              0.2,
              'rgb(255,237,160)',
              0.4,
              'rgb(254,217,118)',
              0.6,
              'rgb(253,141,60)',
              0.8,
              'rgb(252,78,42)',
              1,
              'rgb(227,26,28)',
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              20,
              9,
              40,
              15,
              100,
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              15,
              0,
            ],
          },
        });
      }

      if (mapInstance.getSource('weatherStations')) {
        clusterAllWeatherStations(mapInstance);
      }

      if (mapInstance && !showStationMarker && mapInstance.getLayer('clusters') && mapInstance.getLayer('cluster-count') && mapInstance.getLayer('unclustered-point')) {
        mapInstance.removeLayer('clusters');
        mapInstance.removeLayer('cluster-count');
        mapInstance.removeLayer('unclustered-point');
      }
    }
  }, [
    showLosMasser,
    showBedrock,
    showRadonLayer,
    showForesight,
    showStationMarker,
    mapInstance,
    foresightData,
  ]);
};

export default useMapLayers;
