interface ILogger {
    info(message: string, data?: any): void;
    error(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    debug(message: string, data?: any): void;
}

class LoggerService {
    constructor(private logger: ILogger) {}

    info(message: string, data?: any): void {
        this.logger.info(message, data ?? {});
    }

    error(message: string, data?: any): void {
        this.logger.error(message, data ?? {});
    }

    warn(message: string, data?: any): void {
        this.logger.warn(message, data ?? {});
    }

    debug(message: string, data?: any): void {
        this.logger.debug(message, data ?? {});
    }
}

export const Logger = new LoggerService(console);
