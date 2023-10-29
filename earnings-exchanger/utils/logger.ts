import pino from 'pino';
import { getEnvVariable } from './config';

interface ILogger {
    info(message: string, data?: any): void;
    error(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    debug(message: string, data?: any): void;
}

class LoggerService {
    constructor(private logger: ILogger) {}

    info(message: string, data?: any): void {
        this.logger.info(data ?? {}, message);
    }

    error(message: string, data?: any): void {
        this.logger.error(data ?? {}, message);
    }

    warn(message: string, data?: any): void {
        this.logger.warn(data ?? {}, message);
    }

    debug(message: string, data?: any): void {
        this.logger.debug(data ?? {}, message);
    }
}

const SHOULD_LOG_DEBUG = getEnvVariable("SHOULD_LOG_DEBUG") === 'true' ? true : false
const pinoOptions = SHOULD_LOG_DEBUG ? { level: 'debug' } : {}

export const Logger = new LoggerService(pino(pinoOptions));
