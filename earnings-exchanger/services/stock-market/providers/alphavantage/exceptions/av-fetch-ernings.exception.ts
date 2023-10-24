import { Exception } from '../../../../../utils/errors';

export class AVFetchErningsError extends Exception {
    constructor(message: string, originalError?: Error) {
        super(message, originalError);
    }
}
