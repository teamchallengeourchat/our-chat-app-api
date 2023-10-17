export class ApiError extends Error {
	constructor(status, message, errors = {}) {
		super(message)

		this.status = status
		this.errors = errors
	}

	static BadRequest(message, errors) {
		return new ApiError(400, message, errors)
	}

	static NotValidData(message, errors) {
		return new ApiError(422, message, errors)
	}

	static Unauthorized() {
		return new ApiError(401, 'User is not authorized')
	}

	static NotFound() {
		return new ApiError(404, 'Not found')
	}
}
