import { useState, useCallback } from 'react';
import axios from 'axios';

function useCachedFetch() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchCachedData = useCallback(async (url: string, key: string, ttl: number, params = {}) => {
        const getCachedData = (key: string, ttl: number) => {
            const cachedItem = localStorage.getItem(key);
            if (!cachedItem) return null;

            const { data, timestamp } = JSON.parse(cachedItem);

            if (Date.now() - timestamp > ttl) {
                localStorage.removeItem(key);
                return null;
            }

            return data;
        };

        const setCachedData = (key: string, data: any) => {
            const item = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(item));
        };

        try {
            setLoading(true);
            const cachedData = getCachedData(key, ttl);
            if (cachedData) {
                setData(cachedData);
                return cachedData;
            } else {
                const response = await axios.get(url, { params });
                setCachedData(key, response.data);
                setData(response.data);
                return response.data;
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { responseData: data, loading, error, fetchCachedData };
}

export default useCachedFetch;
