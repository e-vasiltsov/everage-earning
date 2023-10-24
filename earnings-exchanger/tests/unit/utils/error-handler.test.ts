import { handleErrors, CustomErrorHandler, ValidationErrorHandler } from '../../../utils/error-handler';
import { CustomError, HttpNotFound, HttpInternalServerError, Exception, EnvVarError } from '../../../utils/errors';
import { Logger } from '../../../utils/logger';

import { ValidationError } from 'yup';

// Mock Logger to prevent actual logging during tests
jest.mock('../../../utils/logger');

describe('handleErrors', () => {
    it('handles CustomError correctly', () => {
        const customError = new HttpNotFound();

        const response = handleErrors(customError);

        expect(response).toEqual({
            statusCode: 404,
            body: JSON.stringify({ message: 'Not Found' }),
        });
        expect(Logger.warn).toHaveBeenCalledWith('HttpNotFound', customError);
    });

    it('handles ValidationError correctly', () => {
        const validationError = new ValidationError('Validation failed', 'test_value', 'test_path');

        const response = handleErrors(validationError);

        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({ errors: ['Validation failed'], field: 'test_path' }),
        });
        expect(Logger.warn).toHaveBeenCalledWith('ValidationError', validationError);
    });

    it('handles unknown errors', () => {
        const unknownError = new Error('Unknown error');

        const response = handleErrors(unknownError);

        expect(Logger.error).toHaveBeenCalledWith('Unknown error:', unknownError);
        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        });
    });
});

describe('CustomErrorHandler', () => {
    const handler = new CustomErrorHandler();

    it('detects if it can handle an error', () => {
        const customError = new CustomError('Test Error', 400);
        expect(handler.canHandle(customError)).toBe(true);
        expect(handler.canHandle(new Error())).toBe(false);
    });

    it('handles CustomError correctly', () => {
        const customError = new CustomError('Test Error', 400);

        const response = handler.handle(customError);

        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({ message: 'Test Error' }),
        });
    });
});

describe('ValidationErrorHandler', () => {
    const handler = new ValidationErrorHandler();

    it('detects if it can handle an error', () => {
        const validationError = new ValidationError('Validation failed', 'test_value', 'test_path');
        expect(handler.canHandle(validationError)).toBe(true);
        expect(handler.canHandle(new Error())).toBe(false);
    });

    it('handles ValidationError correctly', () => {
        const validationError = new ValidationError('Validation failed', 'test_value', 'test_path');

        const response = handler.handle(validationError);

        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({ errors: ['Validation failed'], field: 'test_path' }),
        });
    });
});
