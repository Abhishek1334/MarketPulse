// Lightweight in-memory namespace-scoped TTL cache.
// Used to extend Twelve Data's free-tier quota by memoizing identical
// requests within their useful freshness window.

const stores = new Map();
const stats = { hits: 0, misses: 0 };

const MAX_ENTRIES_PER_NAMESPACE = 500;

const getStore = (namespace) => {
	let store = stores.get(namespace);
	if (!store) {
		store = new Map();
		stores.set(namespace, store);
	}
	return store;
};

export const cacheGet = (namespace, key) => {
	const store = getStore(namespace);
	const entry = store.get(key);
	if (!entry) {
		stats.misses++;
		return null;
	}
	if (Date.now() > entry.expiresAt) {
		store.delete(key);
		stats.misses++;
		return null;
	}
	stats.hits++;
	return entry.value;
};

export const cacheSet = (namespace, key, value, ttlMs) => {
	const store = getStore(namespace);
	store.set(key, { value, expiresAt: Date.now() + ttlMs });
	if (store.size > MAX_ENTRIES_PER_NAMESPACE) {
		// Evict oldest insertion (Map iteration order = insertion order)
		const oldestKey = store.keys().next().value;
		store.delete(oldestKey);
	}
};

export const cacheStats = () => {
	const sizes = {};
	for (const [ns, store] of stores) sizes[ns] = store.size;
	const total = stats.hits + stats.misses;
	return {
		hits: stats.hits,
		misses: stats.misses,
		hitRate: total === 0 ? 0 : Number((stats.hits / total).toFixed(3)),
		sizes,
	};
};

// Express middleware factory. Wraps a handler so identical req.query payloads
// served within ttlMs are answered from memory.
export const withCache = (namespace, ttlMs) => (handler) =>
	async (req, res, next) => {
		const key = JSON.stringify(req.query || {});
		const cached = cacheGet(namespace, key);
		if (cached !== null) {
			res.set("X-Cache", "HIT");
			return res.json(cached);
		}
		const originalJson = res.json.bind(res);
		res.json = (data) => {
			if (res.statusCode === 200) {
				cacheSet(namespace, key, data, ttlMs);
			}
			res.set("X-Cache", "MISS");
			return originalJson(data);
		};
		return handler(req, res, next);
	};
