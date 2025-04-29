
const errorHandler = (err, req, res) => {
	const statusCode = err.statusCode || 500;
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
