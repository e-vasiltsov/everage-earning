import * as dotenv from 'dotenv';
dotenv.config();

import { EnvVarError } from './errors';

export const getEnvVariable = (name: string): string => {
    const value = process.env[name];

    if (!value) {
        throw new EnvVarError(`Environment variable ${name} is not set.`);
    }

    if (value.trim() === '') {
        throw new EnvVarError(`Environment variable ${name} is set but empty.`);
    }

    return value;
};
