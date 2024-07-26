import { useEffect, useState } from "react";
import { getObservations } from "../apiController";
import { IweatherStation } from "../interface/IweatherStation";
import IObservationData from "../interface/IObservationData";

interface IObservationsData {
  [key: string]: IObservationData[] | null;
}

const useFetchGetObservations = (stations: IweatherStation[], referenceTime: string) => {
  const [observations, setObservations] = useState<IObservationsData>({});
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObservations = async () => {
      setLoading(true);
      const tempObservations: IObservationsData = {};

      try {
        const sortedStations = [...stations].sort((a, b) => a.distance - b.distance);

        for (const station of sortedStations) {
          const elements = station.elementId.split(',').map((element: string) => element.trim());

          const apiResult = await getObservations(station.geometry.coordinates, referenceTime, elements.join(','));
          tempObservations[station.id] = apiResult.filter((obs: IObservationData) => obs.sourceId.startsWith(station.id + ':'));
        }

        setObservations(tempObservations);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (stations.length > 0) {
      fetchObservations();
    }
  }, [stations, referenceTime]); 

  return { observations, error, loading };
};

export default useFetchGetObservations;
