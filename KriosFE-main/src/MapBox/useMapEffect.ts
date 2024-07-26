import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import WeatherPopup from "./weatherpopup"; // Adjust the import path as needed
import placeWeatherStationMarker from "./placeWeatherStationMarker"; // Adjust the import path as needed
import { updateMarker } from "./updateMarker"; // Adjust the import path as needed
import { IweatherStation } from "../interface/IweatherStation";

interface MarkerColor {
  id: string;
  color: string;
}

interface UseMapEffectProps {
  data: IweatherStation[] | null;
  coords: mapboxgl.LngLat | null;
  mapInstance: mapboxgl.Map | null;
  markerImage: string;
  stationMarkerRef: React.MutableRefObject<mapboxgl.Marker[]>;
  markerRef: React.MutableRefObject<mapboxgl.Marker | null>;
  forecastData: any;
  setMarkerColors: React.Dispatch<React.SetStateAction<MarkerColor[]>>;
  address: string;
  handleReadMore: () => void;
}

const useMapEffect = ({
  data,
  coords,
  mapInstance,
  markerImage,
  stationMarkerRef,
  markerRef,
  forecastData,
  setMarkerColors,
  address,
  handleReadMore,
}: UseMapEffectProps) => {
  const clearMarkers = () => {
    if (stationMarkerRef.current) {
      stationMarkerRef.current.forEach((marker) => marker.remove());
      stationMarkerRef.current = [];
    }
  };

  const placeMarkers = () => {
    if (data && mapInstance) {
      data.forEach((stationData) => {
        const { geometry, distance, id, shortName } = stationData;
        const stationCoords: [number, number] = geometry.coordinates as [
          number,
          number
        ];
        const color = placeWeatherStationMarker({
          map: mapInstance,
          markerRef: stationMarkerRef,
          coordinates: new mapboxgl.LngLat(stationCoords[0], stationCoords[1]),
          id,
          name: shortName,
          imageUrl: markerImage,
          distance,
        });
        setMarkerColors((prevColors: MarkerColor[]) => [
          ...prevColors,
          { id, color },
        ]);
      });
    }
  };

  const handleForecastData = () => {
    if (forecastData && forecastData.properties?.timeseries?.length > 0) {
      const now = new Date();
      const closestTimeseries = forecastData.properties.timeseries.reduce(
        (prev: any, curr: any) => {
          const prevDate = new Date(prev.time);
          const currDate = new Date(curr.time);
          const prevDiff = Math.abs(prevDate.getTime() - now.getTime());
          const currDiff = Math.abs(currDate.getTime() - now.getTime());
          return prevDiff < currDiff ? prev : curr;
        }
      );

      if (closestTimeseries?.data?.instant?.details) {
        const latestWeatherDetails = closestTimeseries.data.instant.details;
        const popupContentElement = document.createElement("div");
        ReactDOM.render(
          React.createElement(WeatherPopup, {
            address,
            details: latestWeatherDetails,
            onReadMore: handleReadMore,
          }),
          popupContentElement
        );

        if (coords) {
          updateMarker(mapInstance!, markerRef, coords, popupContentElement);
        } else {
          console.error("Coordinates are missing for the popup");
        }
      }
    } else {
      console.error("Forecast data is missing or incomplete.");
    }
  };

  const updateLocationInfo = () => {
    clearMarkers();
    placeMarkers();
    handleForecastData();
  };

  useEffect(() => {
    if (data && coords && mapInstance) {
      if (mapInstance.isStyleLoaded()) {
        updateLocationInfo();
      }
    }
    return () => {
      ReactDOM.unmountComponentAtNode(document.createElement("div"));
    };
  }, [
    data,
    coords,
    mapInstance,
    markerImage,
    stationMarkerRef,
    markerRef,
    forecastData,
  ]);

  return null;
};

export default useMapEffect;
