import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { LngLat } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import markerImage from "../assets/icons/weatherStation.png";
import useFetchNearestWeatherStation from "../FetchFunctions/useFetchNearestWeatherStation";
import { updateMarker } from "./updateMarker";
import placeWeatherStationMarker from "./placeWeatherStationMarker";
import mapClickHandler from "./mapClickHandler";
import Sidebar from "./Sidebar";
import stationImage from "../assets/icons/station.png";
import BoundsAlert from "../alerts/BoundsAlert";
import useGetAllWeatherStations from "../FetchFunctions/useGetAllWeatherStations";
import layersIcon from "../assets/icons/layers.png";
import useFetchGetForecast from "../FetchFunctions/useFetchGetForecast";
import "@fortawesome/fontawesome-free/css/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faHouse } from "@fortawesome/free-solid-svg-icons";
import WeatherPopup from "./weatherpopup";
import useFetchGetForesight from "../FetchFunctions/useFetchGetForesight";
import HeatmapLegend from "./HeatmapLegend";
import { NavLink } from "react-router-dom";
import useMapLayers from "./useMapLayers";
import useMapEffect from "./useMapEffect"; 

const css = require("../stylesheets/map.css");

interface MapProps {
  accessToken: string;
}

interface MarkerColor {
  id: string;
  color: string;
}

const Map: React.FC<MapProps> = ({ accessToken }) => {
  let markerRef = useRef<mapboxgl.Marker | null>(null);
  let stationMarkerRef = useRef<mapboxgl.Marker[]>([]);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [coords, setCoords] = useState<LngLat | null>(null);
  const [address, setAddress] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStationMarker, setShowStationMarker] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [mapStyle, setMapStyle] = useState<string>(
    "mapbox://styles/projectkrios/cltmwyv6x009i01pc82g040np"
  );
  const [satelliteView, setSatelliteView] = useState<boolean>(false);
  const [markerColors, setMarkerColors] = useState<MarkerColor[]>([]);
  const [showWMSMenu, setShowWMSMenu] = useState(false);
  const [showRadonLayer, setShowRadonLayer] = useState(false);
  const [radonLegendUrl, setRadonLegendUrl] = useState("");
  const [showBedrock, setShowBedrockLayer] = useState(false);
  const [bedrockLegendUrl, setBedrockLegendUrl] = useState("");
  const [showLosMasser, setShowLosMasser] = useState(false);
  const [losmasserLegendUrl, setLosmasserLegendUrl] = useState("");
  const [showForesight, setShowForesight] = useState(false);

  const memoizedCoords = useMemo(() => {
    return coords ? { lat: coords.lat, lng: coords.lng } : null;
  }, [coords ? coords.lat : null, coords ? coords.lng : null]);

  const { data, error, loading } =
    useFetchNearestWeatherStation(memoizedCoords);
  const {
    data: forecastData,
    error: forecastError,
    loading: forecastLoading,
  } = useFetchGetForecast(memoizedCoords);
  const {
    data: foresightData,
    error: foresightError,
    loading: foresightLoading,
  } = useFetchGetForesight();

  const handleReadMore = () => {
    console.log("Read More clicked");
    setIsSidebarOpen(true);
  };

  const handleModal = (message: string, isOpen: boolean) => {
    setModalMessage(message);
    setIsModalOpen(isOpen);
  };

  const weatherStations = useGetAllWeatherStations();

  const toggleRadonLayer = () => toggleLayer("radon");
  const toggleBedrockLayer = () => toggleLayer("bedrock");
  const toggleLosLayer = () => toggleLayer("losmasser");
  const toggleForesight = () => toggleLayer("foresight");
  const toggleStationMarker = () => toggleLayer("showStationMarker");

  const toggleLayer = (layer: string) => {
    switch (layer) {
      case "radon":
        setShowRadonLayer((prev) => !prev);
        setShowBedrockLayer(false);
        setShowLosMasser(false);
        setShowForesight(false);
        break;
      case "bedrock":
        setShowBedrockLayer((prev) => !prev);
        setShowRadonLayer(false);
        setShowLosMasser(false);
        setShowForesight(false);
        break;
      case "losmasser":
        setShowLosMasser((prev) => !prev);
        setShowRadonLayer(false);
        setShowBedrockLayer(false);
        setShowForesight(false);
        break;
      case "foresight":
        setShowForesight((prev) => !prev);
        setShowRadonLayer(false);
        setShowBedrockLayer(false);
        setShowLosMasser(false);
        break;
        case "showStationMarker":
          setShowStationMarker(prev => !prev);
          break
      default:
        break;
    }
  };

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    const bounds = [
      [4.63, 57.9776],
      [31.078, 71.1851],
    ];

    const map = new mapboxgl.Map({
      container: "map",
      style: mapStyle,
      center: [2.407455447512632, 60.07541954856802],
      zoom: 4.5,
      pitch: 40,
      bearing: 60,
    });

    const onMapLoad = () => setMapInstance(map);
    map.on("load", onMapLoad);
    map.setMaxBounds(bounds as mapboxgl.LngLatBoundsLike);

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Søk",
      countries: "no",
      marker: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.addControl(geocoder, "top-right");
    map.addControl(new mapboxgl.ScaleControl());

    const geocoderContainer = document.querySelector(
      ".mapboxgl-ctrl-geocoder"
    ) as HTMLElement;
    geocoderContainer.style.position = "absolute";
    geocoderContainer.style.top = "10px";
    geocoderContainer.style.right = "10px";
    geocoderContainer.style.zIndex = "1";

    geocoder.on("result", (event) => {
      const eventResult = event.result.geometry?.coordinates;
      if (eventResult && eventResult.length === 2) {
        const coordinates: [number, number] = [eventResult[0], eventResult[1]];
        map.once("idle", () => {
          mapClickHandler(
            coordinates,
            map,
            setCoords,
            accessToken,
            handleModal,
            setAddress
          );
        });
      } else {
        console.error(
          "Unable to extract valid coordinates from the result:",
          event.result
        );
      }
    });

    map.on("click", (event) => {
      const coordinates: [number, number] = [
        event.lngLat.lng,
        event.lngLat.lat,
      ];
      mapClickHandler(
        coordinates,
        map,
        setCoords,
        accessToken,
        handleModal,
        setAddress
      );
    });

    return () => {
      map.remove();
      map.off("load", onMapLoad);
    };
  }, [accessToken]);

  useMapLayers({
    mapInstance,
    showRadonLayer,
    showBedrock,
    showLosMasser,
    showStationMarker,
    showForesight,
    weatherStations,
    foresightData,
    setRadonLegendUrl,
    setBedrockLegendUrl,
    setLosmasserLegendUrl,
  });


  useMapEffect({
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
  });



  useEffect(() => {
    const mapStyle = satelliteView
      ? "mapbox://styles/mapbox/satellite-streets-v12"
      : "mapbox://styles/projectkrios/cltmwyv6x009i01pc82g040np";

    if (mapInstance) {
      mapInstance.setStyle(mapStyle);
    }
  }, [accessToken, satelliteView]);

  const toggleSatelliteView = () => {
    setSatelliteView((prev) => !prev);
  };

  const switchMapStyle = () => {
    const newStyle =
      mapStyle === "mapbox://styles/projectkrios/cltmwyv6x009i01pc82g040np"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/projectkrios/cltmwyv6x009i01pc82g040np";
    setMapStyle(newStyle);

    console.log("Map style", newStyle);
  };

  return (
    <>
      <NavLink
        to="/"
        className="home-btn"
        style={{
          position: "absolute",
          width: 32,
          height: 32,
          background: "white",
          zIndex: 3,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 9,
          marginTop: 9,
        }}
      >
        <FontAwesomeIcon icon={faHouse} color="black" />
        <span className="home-btn-tooltip">Gå hjem</span>
      </NavLink>

      <div
        className="switch-mapstyle-btn"
        style={{
          position: "absolute",
          width: 32,
          height: 32,
          background: "white",
          zIndex: 3,
          borderRadius: 10,
          top: "66%",
          right: "0%",
          marginRight: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          switchMapStyle();
          toggleSatelliteView();
        }}
      >
        <img
          src={layersIcon}
          style={{ width: 15, height: 15 }}
          alt="Map style btn"
        />
        <span className="switch-mapstyle-btn-tooltip">Bytt kartstil</span>
      </div>

      {isModalOpen && (
        <BoundsAlert
          message={modalMessage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {!showStationMarker ? (
        <div
          className="show-station-marker-btn"
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            background: "lightGray",
            zIndex: 3,
            borderRadius: 10,
            top: "73%",
            right: "0%",
            marginRight: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}

          onClick={toggleStationMarker}
        >
          <img
            src={stationImage}
            style={{ width: 20, height: 20 }}
            alt="weather station logo"
          />
          <span className="show-station-marker-btn-tooltip">
            Vis værstasjoner
          </span>
        </div>
      ) : (
        <div
          className="close-station-marker-btn"
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            background: "white",
            zIndex: 3,
            borderRadius: 10,
            top: "73%",
            right: "0%",
            marginRight: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}

            onClick={toggleStationMarker}
          >
            <img src={stationImage} style={{ width: 20, height: 20 }} alt="weather station logo" />
          <span className="close-station-marker-btn-tooltip">Skjul værstasjoner</span>
          </div>
        )}
  <div
        style={{
          position: "absolute",
          width: 32,
          height: 32,
          background: showRadonLayer ? "white" : "lightGray",
          zIndex: 3,
          borderRadius: 10,
          top: "79%",
          right: "0%",
          marginRight: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onMouseEnter={() => setShowWMSMenu(true)}
        onMouseLeave={() => setShowWMSMenu(false)}
      >
        <FontAwesomeIcon
          icon={faMap}
          size="lg"
          style={{
            color:
              showRadonLayer || showBedrock || showLosMasser || showForesight
                ? "blue"
                : "grey",
          }}
        />
        {showWMSMenu && (
          <div className="wmsMenu">
            <label className="switch">
              <input
                type="checkbox"
                checked={showRadonLayer}
                onChange={toggleRadonLayer}
              />
              <span className="slider round"></span>
              <div className="labelText">Radon</div>
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={showBedrock}
                onChange={toggleBedrockLayer}
              />
              <span className="slider round"></span>
              <div className="labelText">Berggrunn</div>
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={showLosMasser}
                onChange={toggleLosLayer}
              />
              <span className="slider round"></span>
              <div className="labelText">Løsmasse</div>
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={showForesight}
                onChange={toggleForesight}
              />
              <span className="slider round"></span>
              <div className="labelText">Fremskrivning</div>
            </label>
          </div>
        )}
      </div>
      <div className="LegendContainer">
        {radonLegendUrl && (
          <div
            className="legend"
            style={{
              position: "absolute",
              top: "10%",
              right: "10px",
              zIndex: 1000,
              padding: "10px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Radonnivå
            </div>
            <img
              src={radonLegendUrl}
              alt="Radon Legend"
              style={{ width: "auto", height: "100px" }}
            />
          </div>
        )}
        {bedrockLegendUrl && (
          <div
            className="bedrockLegend legend"
            style={{
              position: "absolute",
              top: "10%",
              right: "10px",
              zIndex: 1000,
              padding: "10px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Berggrunn
            </div>
            <img
              className="bedrockImg"
              src={bedrockLegendUrl}
              alt="Berggrunn Legend"
              style={{ width: "auto", height: "100px" }}
            />
          </div>
        )}
        {losmasserLegendUrl && (
          <div
            className="losmasseLegend legend"
            style={{
              position: "absolute",
              top: "10%",
              right: "10px",
              zIndex: 1000,
              padding: "10px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Løsmasse
            </div>
            <img
              className="losmasseImg"
              src={losmasserLegendUrl}
              alt="Løsmasse Legend"
              style={{ width: "auto", height: "100px" }}
            />
          </div>
        )}
        {showForesight && <HeatmapLegend />}
      </div>
      <div
        id="map"
        style={{ position: "relative", height: "100vh", zIndex: 2 }}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        stations={data}
        colors={markerColors}
      />
      <div
        id="map"
        style={{ position: "relative", height: "100vh", zIndex: 2 }}
      />
    </>
  );
};

export default Map;
