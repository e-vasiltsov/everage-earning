import { Exception } from '../../../../../utils/errors';

export class AVCurrencyExchangeObjError extends Exception {
    constructor(message: string, originalError?: Error) {
        super(message, originalError);
    }
}
