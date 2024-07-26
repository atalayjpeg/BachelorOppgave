export interface IGeoJson {
    type: "FeatureCollection";
    features: GeoJsonFeature[];
  }

  export interface GeoJsonFeature {
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      time: string;
      precipitation: number;
    };
  }