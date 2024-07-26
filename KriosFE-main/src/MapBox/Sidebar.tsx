import React, { useState, useMemo } from "react";
import "../stylesheets/sidebar.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faCloudShowersHeavy,
  faDroplet,
  faTemperature0,
  faXmark,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import useFetchGetObservations from "../FetchFunctions/useFetchGetObservations";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { IweatherStation } from "../interface/IweatherStation";
import IObservationData from "../interface/IObservationData";
import { Observation } from "../interface/IObservationData";
const css = require("../stylesheets/sidebar.css");

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  stations: IweatherStation[] | null;
  colors: { id: string; color: string }[];
}

interface IObservationsData {
  [key: string]: IObservationData[] | null;
}

const calculateDataBounds = (data: number[]) => {
  if (data.length === 0) return { min: 0, max: 1 };
  let min = data[0],
    max = data[0];
  data.forEach((value) => {
    if (value < min) min = value;
    if (value > max) max = value;
  });
  return { min, max };
};

const useExtractChartData = (
  observations: IObservationsData | null,
  elementId: string,
  colors: { id: string; color: string }[]
): [ChartData<"line">, { min: number; max: number }, string[]] => {
  return useMemo(() => {
    const labels: string[] = [];
    const dataPoints: { x: number; y: number; color: string }[] = [];
    const seenDates = new Set<number>();
    const usedStationIds = new Set<string>();

    if (observations) {
      const allObservations = Object.entries(observations).flatMap(([stationId, stationData]) =>
        stationData?.flatMap((observationData: IObservationData) =>
          observationData.observations.filter((obs: Observation) => obs.elementId === elementId).map((obs: Observation) => ({
            date: new Date(observationData.referenceTime).getTime(),
            value: obs.value,
            stationId,
            color: colors.find(color => color.id === observationData.sourceId.split(":")[0])?.color || "rgb(75, 192, 192)"
          }))
        ) ?? []
      );

      const sortedObservations = allObservations.sort((a, b) => a.date - b.date || a.stationId.localeCompare(b.stationId));

      const dateToObservationMap: { [key: number]: { value: number; color: string; stationId: string } } = {};

      sortedObservations.forEach(obs => {
        if (!dateToObservationMap[obs.date]) {
          dateToObservationMap[obs.date] = { value: obs.value, color: obs.color, stationId: obs.stationId };
          usedStationIds.add(obs.stationId);
        }
      });

      Object.entries(dateToObservationMap).forEach(([date, { value, color, stationId }]) => {
        const dateNumber = parseInt(date);
        if (!seenDates.has(dateNumber)) {
          seenDates.add(dateNumber);
          labels.push(new Date(dateNumber).toLocaleDateString());
          dataPoints.push({ x: dateNumber, y: value, color: color });
        }
      });
    }

    const { min, max } = calculateDataBounds(dataPoints.map(dp => dp.y));
    const usedStationIdsArray = Array.from(usedStationIds);

    return [
      {
        labels,
        datasets: [
          {
            label: `Stations: ${usedStationIdsArray.join(', ')}`,
            data: dataPoints,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
            pointBackgroundColor: dataPoints.map(dp => dp.color)
          }
        ]
      },
      { min, max },
      usedStationIdsArray
    ];
  }, [observations, elementId, colors]);
};




const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  closeSidebar,
  stations,
  colors,
}) => {
  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState("2024-01-01");
  const sidebarClasses = `sidebar${isOpen ? " open" : ""}`;
  const { observations, error, loading } = useFetchGetObservations(
    stations ?? [],
    `${startDate}%2F${endDate}`
  );
  const [timeFrame, setTimeFrame] = useState("P1M");

  const [showSunlight, setShowSunlight] = useState(true);
  const [showHumidity, setShowHumidity] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const [showPrecipitation, setShowPrecipitation] = useState(true);

  const [sunlightChartData, sunlightBounds, sunlightStations] =
    useExtractChartData(
      observations,
      `sum(duration_of_sunshine ${timeFrame})`,
      colors
    );
  const [humidityChartData, humidityBounds, humidityStations] =
    useExtractChartData(
      observations,
      `mean(relative_humidity ${timeFrame})`,
      colors
    );
  const [temperatureChartData, temperatureBounds, temperatureStations] =
    useExtractChartData(
      observations,
      `mean(air_temperature ${timeFrame})`,
      colors
    );
  const [precipitationChartData, precipitationBounds, precipitationStations] =
    useExtractChartData(observations, "sum(precipitation_amount P1Y)", colors);

  const options = (bounds: { min: number; max: number }): ChartOptions<"line"> => ({
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: bounds.min - (bounds.max - bounds.min) * 0.1,
        suggestedMax: bounds.max + (bounds.max - bounds.min) * 0.1,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const raw = context.raw as { x: number; y: number };
            const date = new Date(raw.x).toLocaleDateString();
            return `${label}: (${date}, ${raw.y})`;
          },
        },
      },
      legend: { display: true },
    },
  });

  const toggleChartVisibility = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prevState) => !prevState);
  };

  return (
    <div className={sidebarClasses}>
      <button className="btn" onClick={closeSidebar}>
        <FontAwesomeIcon icon={faXmark} />
        <span className="btn-tooltip">Lukk</span>
      </button>
      <h1>Værhistorikk</h1>
      <div className="calendarWrap">
        <label htmlFor="start-date"></label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="end-date"></label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button
        className="toggler"
        onClick={() => setTimeFrame(timeFrame === "P1M" ? "P1Y" : "P1M")}
      >
        {timeFrame === "P1M" ? "Pr År" : "Pr Mnd"}
      </button>
      <div className="graphWrapper">
        <div
          className="graphEntry"
          onClick={() => toggleChartVisibility(setShowTemperature)}
        >
          <FontAwesomeIcon
            icon={faTemperature0}
            style={{ marginRight: "8px" }}
          />
          Temperatur
          <FontAwesomeIcon
            icon={showTemperature ? faAngleUp : faAngleDown}
            style={{ marginRight: "8px" }}
          />
          {showTemperature && (
            <Line
              data={temperatureChartData}
              options={options(temperatureBounds)}
            />
          )}
        </div>
        <div
          className="graphEntry"
          onClick={() => toggleChartVisibility(setShowPrecipitation)}
        >
          <FontAwesomeIcon
            icon={faCloudShowersHeavy}
            style={{ marginRight: "8px" }}
          />
          Nedbør
          <FontAwesomeIcon
            icon={showPrecipitation ? faAngleUp : faAngleDown}
            style={{ marginRight: "8px" }}
          />
          {showPrecipitation && (
            <Line
              data={precipitationChartData}
              options={options(precipitationBounds)}
            />
          )}
        </div>
        <div
          className="graphEntry"
          onClick={() => toggleChartVisibility(setShowHumidity)}
        >
          <FontAwesomeIcon icon={faDroplet} style={{ marginRight: "8px" }} />
          Luftfuktighet
          <FontAwesomeIcon
            icon={showHumidity ? faAngleUp : faAngleDown}
            style={{ marginRight: "8px" }}
          />
          {showHumidity && (
            <Line data={humidityChartData} options={options(humidityBounds)} />
          )}
        </div>
        <div
          className="graphEntry"
          onClick={() => toggleChartVisibility(setShowSunlight)}
        >
          <FontAwesomeIcon icon={faSun} style={{ marginRight: "8px" }} />
          Solskinnstimer
          <FontAwesomeIcon
            icon={showSunlight ? faAngleUp : faAngleDown}
            style={{ marginRight: "8px" }}
          />
          {showSunlight && (
            <Line data={sunlightChartData} options={options(sunlightBounds)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
