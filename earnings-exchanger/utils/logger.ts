import pino from 'pino';

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

export const Logger = new LoggerService(pino({ level: 'debug' }));
