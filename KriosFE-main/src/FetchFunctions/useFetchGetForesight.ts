import { useState, useEffect } from "react";
import { GeoJsonFeature, IGeoJson } from "../interface/IGeoJson";
import { getForesight } from "../apiController";

const useFetchGetForesight = (maxRetries: number = 3, retryDelay: number = 1000) => {
    const [data, setData] = useState<IGeoJson | null>(null);
    const [error, setError] = useState<unknown | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForesight = async (retries: number) => {
            setLoading(true);
            try {
                console.log("Fetching foresight");
                const data: IGeoJson = await getForesight();
                setData(data);
                console.log(data);
                setError(null);
            } catch (err) {
                if (retries > 0) {
                    console.log(`Retrying... (${maxRetries - retries + 1}/${maxRetries})`);
                    setTimeout(() => fetchForesight(retries - 1), retryDelay);
                } else {
                    const message = err instanceof Error ? err.message : 'An unknown error occurred';
                    setError(message);
                    setData(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchForesight(maxRetries);
    }, [maxRetries, retryDelay]);

    return { data, error, loading };
};

export default useFetchGetForesight;
