// service/RateLimiting.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { getTimeSeriesStockDatafromExternalAPI } from "../api/analyse";

const CACHE_TTL = 1000 * 60 * 5;
const stockDataCache = {};
let apiCallsInCurrentMinute = 0;
let apiCallsToday = 0;

const MAX_REQUESTS_PER_MINUTE = 8;
const MAX_REQUESTS_PER_DAY = 800;

export const makeCacheKey = (symbol, interval, startDate, endDate) => {
	const format = (date) => date && new Date(date).toISOString().split("T")[0];
	return `${symbol}-${interval}-${format(startDate) || "noStart"}-${
		format(endDate) || "noEnd"
	}`;
};

const useRateLimitedFetch = () => {
	const [queue, setQueue] = useState([]);
	const [results, setResults] = useState({});
	const [isFetching, setIsFetching] = useState(false);
	const isMountedRef = useRef(true);
	const queueRef = useRef(queue);

	

	
	

	const fetchData = useCallback(
		async (symbol, interval = "1d", startDate, endDate) => {
			const key = makeCacheKey(symbol, interval, startDate, endDate);
			const cached = stockDataCache[key];
			const now = Date.now();

			if (cached && now - cached.timestamp < CACHE_TTL) {
				(`Cache hit for ${key}:`, cached.data);
				return { success: true, data: cached.data };
			}

			if (apiCallsInCurrentMinute >= MAX_REQUESTS_PER_MINUTE) {
				return {
					success: false,
					error: "Rate limit exceeded (minute)",
				};
			}
			if (apiCallsToday >= MAX_REQUESTS_PER_DAY) {
				return { success: false, error: "Rate limit exceeded (day)" };
			}

			try {
				const response = await getTimeSeriesStockDatafromExternalAPI(
					symbol,
					interval,
					startDate,
					endDate
				);
				if (response && !response.status?.includes("error")) {
					stockDataCache[key] = { data: response, timestamp: now };
					apiCallsInCurrentMinute++;
					apiCallsToday++;
					return { success: true, data: response };
				}

				return { success: false, error: "Failed to fetch data" };
			} catch (error) {
				console.error("Fetch error:", error);
				return { success: false, error: error.message };
			}
		},
		[]
	);
const processQueue = useCallback(async () => {
	if (!isFetching && queueRef.current.length > 0 && isMountedRef.current) {
		setIsFetching(true);
		const [nextRequest] = queueRef.current;

		try {
			const result = await fetchData(
				nextRequest.symbol,
				nextRequest.interval,
				nextRequest.startDate,
				nextRequest.endDate
			);


			if (isMountedRef.current) {
				const key = makeCacheKey(
					nextRequest.symbol,
					nextRequest.interval,
					nextRequest.startDate,
					nextRequest.endDate
				);

				// Update both cache and results state
				setResults((prev) => {
					
					return {
						...prev,
						[key]: result.success
							? result.data
							: { error: result.error },
					};
				});
				setQueue((prev) => prev.slice(1));
			}
		} finally {
			if (isMountedRef.current) {
				setIsFetching(false);
			}
		}
	}
}, [fetchData, isFetching]);

	useEffect(() => {
		const interval = setInterval(() => {
			processQueue();
		}, 500); // Try to process queue every 500ms

		return () => clearInterval(interval);
	}, [processQueue]);

	useEffect(() => {
		queueRef.current = queue;
	}, [queue]);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const addToQueue = useCallback(
		(symbol, interval = "1d", startDate, endDate) => {
			const key = makeCacheKey(symbol, interval, startDate, endDate);


			setQueue((prev) => {
				const existsInQueue = prev.some(
					(item) =>
						makeCacheKey(
							item.symbol,
							item.interval,
							item.startDate,
							item.endDate
						) === key
				);

				if (existsInQueue) return prev;

				const cached = stockDataCache[key];
				if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
					setResults((prevResults) => ({
						...prevResults,
						[key]: cached.data,
					}));
					return prev;
				}

				return [...prev, { symbol, interval, startDate, endDate }];
			});
		},
		[]
	);

	useEffect(() => {
		const minuteTimer = setInterval(() => {
			apiCallsInCurrentMinute = 0;
		}, 60000);

		const dailyTimer = setInterval(() => {
			apiCallsToday = 0;
		}, 86400000);

		return () => {
			clearInterval(minuteTimer);
			clearInterval(dailyTimer);
		};
	}, []);

	return { addToQueue, results, isFetching };
};

export default useRateLimitedFetch;
