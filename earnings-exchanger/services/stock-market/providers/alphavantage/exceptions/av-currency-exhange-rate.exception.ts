import { Exception } from '../../../../../utils/errors';

export class AVCurrencyExchangeRangeError extends Exception {
    constructor(message: string, originalError?: Error) {
        super(message, originalError);
    }
}
