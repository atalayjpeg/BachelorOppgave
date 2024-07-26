import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";
import { Feature, Point, Geometry, GeoJsonProperties } from 'geojson'
import { getFromRedis } from "../apiController";

const useGetAllWeatherStations= (  ) => {
    const [stationData, setStationData] = useState<Feature<Geometry, GeoJsonProperties>[]>([]);

    useEffect(() => {
        const getAllWeatherStations = async () => {
            try {
                const getWeatherStations = await getFromRedis();
                if (getWeatherStations) {
                    const filteredData = getWeatherStations.map(( station: any ) => {
                        const { id, name, countryCode, geometry } = station;

                        return {
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: geometry.coordinates },
                            properties: { id, name, countryCode }
                        } as Feature<Geometry, GeoJsonProperties>;
                    }).filter( ( data: any ) => data !== null ) as Feature<Point, GeoJsonProperties>[];
                    setStationData(filteredData);
                }
            } catch(error) {
                console.error("Error fetching Weather Stations.", error)
            }
        }

        getAllWeatherStations();
        
    }, []);

    return stationData;
}

export default useGetAllWeatherStations;