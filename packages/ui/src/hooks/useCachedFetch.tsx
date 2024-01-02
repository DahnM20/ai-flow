import { useState, useCallback } from 'react';
import axios from 'axios';

export const DEFAULT_NB_ELEMENTS_TO_REMOVE = 5
export const DISPENSABLE_CACHE_PREFIX = 'dispensable_cache'
export const CACHE_PREFIX = 'cache'

function useCachedFetch() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    function clearOldCacheItems() {
        const keys = Object.keys(localStorage);
        const items = keys
            .filter((key) => key.includes(DISPENSABLE_CACHE_PREFIX))
            .map(key => ({
                key,
                data: JSON.parse(localStorage.getItem(key) ?? "")
            }))
            .sort((a, b) => a.data.timestamp - b.data.timestamp);


        items.forEach((item, index) => {
            if (index <= DEFAULT_NB_ELEMENTS_TO_REMOVE) {
                localStorage.removeItem(item.key);
            }
        })

    }

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

            try {
                localStorage.setItem(key, JSON.stringify(item));
            } catch (err: any) {
                if (err.code == 22 || err.code == 1014) {
                    clearOldCacheItems()
                    localStorage.setItem(key, JSON.stringify(item));
                }
                else
                    throw new Error(err.message)
            }

        }

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
