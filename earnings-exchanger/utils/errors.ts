export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class HttpNotFound extends CustomError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

export class HttpInternalServerError extends CustomError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}

export class Exception extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        if (originalError && originalError.stack) {
            this.stack += '\n\n' + originalError.stack;
        }
    }
}

export class EnvVarError extends Error {
    constructor(message: string) {
        super(message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
