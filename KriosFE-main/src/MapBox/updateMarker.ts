import React from "react";
import mapboxgl from "mapbox-gl";
const css = require('../stylesheets/popup.css');


export const updateMarker = (
  map: mapboxgl.Map, 
  markerRef: React.MutableRefObject<mapboxgl.Marker | null>, 
  coordinates: mapboxgl.LngLatLike, 
  popupContentElement: HTMLElement
) => {
  let customPopup = "customPopup"
  if (!markerRef.current) {
    const markerEl = document.createElement('div');
markerEl.className = 'markerClass'; 

const innerEl = document.createElement('div');
innerEl.className = 'innerMarker';
markerEl.appendChild(innerEl);
    const popup = new mapboxgl.Popup({closeButton:true, offset: 35, className: customPopup}).setDOMContent(popupContentElement);
    markerRef.current = new mapboxgl.Marker(markerEl)
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);
      markerRef.current.getPopup().setDOMContent(popupContentElement).addTo(map);
      console.log("placingMarker");
      markerRef.current.getElement().addEventListener('click', (e) => {
        e.stopPropagation(); 
        markerRef.current?.togglePopup(); 
      });
  } else {
    markerRef.current.setLngLat(coordinates);
    

    if (markerRef.current.getPopup()) {
      markerRef.current.getPopup().setDOMContent(popupContentElement);
    }

    if (!markerRef.current.getPopup().isOpen()) {
      markerRef.current.getPopup().addTo(map);
    }
  }
}; 
