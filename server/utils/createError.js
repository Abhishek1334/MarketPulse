export const createError = (message, statusCode = 500, extra = {}) => {
	const err = new Error(message);
	err.statusCode = statusCode;
	Object.assign(err, extra);
	return err;
};
