import React from "react";
import mapboxgl from "mapbox-gl";
import { Feature, Geometry, GeoJsonProperties } from "geojson";

export const clusterAllWeatherStations = (mapInstance: mapboxgl.Map) => {
  mapInstance.addLayer({
    id: "clusters",
    type: "circle",
    source: "weatherStations",
    filter: ["has", "point_count"],
    layout: { visibility: "visible" },
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#89CFF0", // Blue if count under 10
        10,
        "#f1f075", // Yellow if count under 20
        20,
        "#8cf29a", // Green if count under 50
        50,
        "#f28cb1", // red if count under 100
        100,
        "#8cf2cd", // soft green if count over 50
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  });

  mapInstance.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "weatherStations",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      visibility: "visible",
    },
  });

  mapInstance.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "weatherStations",
    filter: ["!", ["has", "point_count"]],
    layout: { visibility: "visible" },
    paint: {
      "circle-color": "#89CFF0",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });
};
