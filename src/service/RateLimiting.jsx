import { useState, useEffect, useCallback, useRef } from "react";
import { getTimeSeriesStockDatafromExternalAPI } from "../api/analyse";

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const stockDataCache = {};
let apiCallsInCurrentMinute = 0;
let apiCallsToday = 0;

const MAX_REQUESTS_PER_MINUTE = 8;
const MAX_REQUESTS_PER_DAY = 800;

const makeCacheKey = (symbol, interval, range, startDate, endDate) =>
	`${symbol}-${interval}-${range}-${startDate || "noStart"}-${
		endDate || "noEnd"
	}`;

const useRateLimitedFetch = () => {
	const [queue, setQueue] = useState([]);
	const [results, setResults] = useState({});
	const [isFetching, setIsFetching] = useState(false);
	const isMountedRef = useRef(true);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const fetchData = useCallback(
		async (symbol, interval = "1d", range = "1mo", startDate, endDate) => {
			const key = makeCacheKey(
				symbol,
				interval,
				range,
				startDate,
				endDate
			);
			const cached = stockDataCache[key];
			const now = Date.now();

			if (cached && now - cached.timestamp < CACHE_TTL) {
				return cached.data;
			}

			if (apiCallsInCurrentMinute >= MAX_REQUESTS_PER_MINUTE) return null;
			if (apiCallsToday >= MAX_REQUESTS_PER_DAY) return null;

			try {
				const data = await getTimeSeriesStockDatafromExternalAPI(
					symbol,
					interval,
					range,
					startDate,
					endDate
				);

				if (data && !data.status?.includes("error")) {
					stockDataCache[key] = { data, timestamp: now };
					apiCallsInCurrentMinute++;
					apiCallsToday++;
					return data;
				}

				return null;
			} catch (error) {
				console.error("Fetch error:", error);
				return null;
			}
		},
		[]
	);

	useEffect(() => {
		if (!isFetching && queue.length > 0) {
			const { symbol, interval, range, startDate, endDate } = queue[0];
			const key = makeCacheKey(
				symbol,
				interval,
				range,
				startDate,
				endDate
			);

			setIsFetching(true);

			(async () => {
				const data = await fetchData(
					symbol,
					interval,
					range,
					startDate,
					endDate
				);
				if (isMountedRef.current && data) {
					setResults((prev) => ({ ...prev, [key]: data }));
				}
				if (isMountedRef.current) {
					setQueue((prev) => prev.slice(1));
					setIsFetching(false);
				}
			})();
		}
	}, [queue, isFetching, fetchData]);

	const addToQueue = useCallback(
		(symbol, interval = "1d", range = "1mo", startDate, endDate) => {
			const exists = queue.some(
				(item) =>
					item.symbol === symbol &&
					item.interval === interval &&
					item.range === range &&
					item.startDate === startDate &&
					item.endDate === endDate
			);

			if (!exists) {
				setQueue((prev) => [
					...prev,
					{ symbol, interval, range, startDate, endDate },
				]);
			}
		},
		[queue]
	);

	useEffect(() => {
		const minuteReset = setInterval(() => {
			apiCallsInCurrentMinute = 0;
		}, 60000);

		const dailyReset = setInterval(() => {
			apiCallsToday = 0;
		}, 86400000);

		return () => {
			clearInterval(minuteReset);
			clearInterval(dailyReset);
		};
	}, []);

	const getResult = (
		symbol,
		interval = "1d",
		range = "1mo",
		startDate,
		endDate
	) => {
		const key = makeCacheKey(symbol, interval, range, startDate, endDate);
		const cached = stockDataCache[key];
		if (!cached) return null;
		if (Date.now() - cached.timestamp > CACHE_TTL) return null;
		return cached.data;
	};

	return { addToQueue, results, isFetching, getResult };
};

export default useRateLimitedFetch;
