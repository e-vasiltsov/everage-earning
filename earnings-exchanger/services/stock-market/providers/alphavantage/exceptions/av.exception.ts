import { Exception } from '../../../../../utils/errors';

export class AVError extends Exception {
    constructor(message: string, originalError?: Error) {
        super(message, originalError);
    }
}
