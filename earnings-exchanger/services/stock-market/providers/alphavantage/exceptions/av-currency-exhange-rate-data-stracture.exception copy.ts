import { Exception } from '../../../../../utils/errors';

export class AVCurrencyExchangeRangeDataStructureError extends Exception {
    constructor(message: string, originalError?: Error) {
        super(message, originalError);
    }
}
