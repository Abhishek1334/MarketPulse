const errorHandler = (err, req, res, next) => {
	console.error("Error occurred:", err);

	// Normalize non-Error objects (like strings) into an Error object
	if (!(err instanceof Error)) {
		err = new Error(err);
	}

	const statusCode =
		err.statusCode && Number.isInteger(err.statusCode)
			? err.statusCode
			: 500;

	const message =
		err.message || "Something went wrong. Please try again later.";

	console.error(`Error: ${message}`);

	res.status(statusCode).json({
		message,
		...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
		statusCode,
	});
};

export default errorHandler;