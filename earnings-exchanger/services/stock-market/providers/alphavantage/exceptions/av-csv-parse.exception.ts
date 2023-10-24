import { Exception } from '../../../../../utils/errors';

export class AVCsvParseError extends Exception {
    constructor(message: string, originalError?: Error) {
        super(message, originalError);
    }
}
