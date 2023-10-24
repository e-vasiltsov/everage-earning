import { ValidationError } from 'yup';
import { CustomError } from './errors';
import { Logger } from './logger';

export const handleErrors = (err: any) => {
    for (const errorHandler of errorHandlers) {
        if (errorHandler.canHandle(err)) {
            Logger.warn(err.constructor.name, err);
            return errorHandler.handle(err);
        }
    }

    Logger.error('Unknown error:', err);
    return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
    };
};

export interface ErrorHandler {
    canHandle(error: any): boolean;
    handle(error: any): any;
}

export class CustomErrorHandler implements ErrorHandler {
    canHandle(error: any): boolean {
        return error instanceof CustomError;
    }

    handle(error: CustomError) {
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({ message: error.message }),
        };
    }
}

export class ValidationErrorHandler implements ErrorHandler {
    canHandle(error: any): boolean {
        return error instanceof ValidationError;
    }

    handle(error: ValidationError) {
        const response = {
            errors: error.errors,
            field: error.path,
        };

        return {
            statusCode: 400,
            body: JSON.stringify(response),
        };
    }
}

export const errorHandlers: ErrorHandler[] = [
    new CustomErrorHandler(),
    new ValidationErrorHandler(),
    // Add other error handlers here...
];
