import { useState, useEffect, useCallback } from "react";
import { getTimeSeriesStockDatafromExternalAPI } from "../api/analyse";

const stockDataCache = {};
let apiCallsInCurrentMinute = 0;
let apiCallsToday = 0;

const MAX_REQUESTS_PER_MINUTE = 8;
const MAX_REQUESTS_PER_DAY = 800;

const useRateLimitedFetch = () => {
	const [queue, setQueue] = useState([]);
	const [results, setResults] = useState([]);
	const [isFetching, setIsFetching] = useState(false);

	const fetchData = useCallback(async (symbol) => {
		if (stockDataCache[symbol]) {
			console.info(`✅ [CACHED] ${symbol}`);
			return stockDataCache[symbol];
		}

		if (apiCallsInCurrentMinute >= MAX_REQUESTS_PER_MINUTE) {
			console.info(`🚫 [LIMIT REACHED: MINUTE] ${symbol}`);
			return null;
		}

		if (apiCallsToday >= MAX_REQUESTS_PER_DAY) {
			console.info(`🚫 [LIMIT REACHED: DAILY] ${symbol}`);
			return null;
		}

		try {
			console.info(`📡 [FETCHING] ${symbol}`);
			const data = await getTimeSeriesStockDatafromExternalAPI(symbol);
			if (data?.status !== "error") {
				stockDataCache[symbol] = data;
				apiCallsInCurrentMinute++;
				apiCallsToday++;
				console.info(`✅ [FETCHED] ${symbol}`);
				return data;
			} else {
				console.warn(`⚠️ [ERROR FROM API] ${symbol}: ${data?.message}`);
				return null;
			}
		} catch (error) {
			console.error(`❌ [ERROR FETCHING] ${symbol}:`, error);
			return null;
		}
	}, []);

	useEffect(() => {
		if (queue.length > 0 && !isFetching) {
			const { symbol } = queue[0];
			setIsFetching(true);

			fetchData(symbol).then((data) => {
				if (data) {
					setResults((prev) => [...prev, data]);
				}
				setIsFetching(false);
				setQueue((prev) => prev.slice(1));
			});
		}
	}, [queue, isFetching, fetchData]);

	const addToQueue = useCallback(
		(symbol) => {
			if (!queue.find((item) => item.symbol === symbol)) {
				console.info(`➕ [QUEUE] ${symbol}`);
				setQueue((prev) => [...prev, { symbol }]);
			}
		},
		[queue]
	);

	useEffect(() => {
		const minuteReset = setInterval(() => {
			apiCallsInCurrentMinute = 0;
			console.info("🔄 [RESET] Minute API limit");
		}, 60000);

		const dailyReset = setInterval(() => {
			apiCallsToday = 0;
			console.info("🔄 [RESET] Daily API limit");
		}, 86400000);

		return () => {
			clearInterval(minuteReset);
			clearInterval(dailyReset);
		};
	}, []);

	return { addToQueue, results, isFetching };
};

export default useRateLimitedFetch;
