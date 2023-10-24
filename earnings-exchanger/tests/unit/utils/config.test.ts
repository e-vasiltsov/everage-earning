import { getEnvVariable } from '../../../utils/config';
import { EnvVarError } from '../../../utils/errors';

describe('getEnvVariable', () => {
    afterEach(() => {
        jest.resetModules(); // Clear any cached modules
    });

    it('returns the correct env variable when it exists and is not empty', () => {
        process.env.TEST_VAR = 'test_value';
        const result = getEnvVariable('TEST_VAR');
        expect(result).toBe('test_value');
    });

    it('throws an error when the env variable is not set', () => {
        expect(() => getEnvVariable('UNSET_VAR')).toThrow(EnvVarError);
        expect(() => getEnvVariable('UNSET_VAR')).toThrow('Environment variable UNSET_VAR is not set.');
    });

    it('throws an error when the env variable is set but empty', () => {
        process.env.EMPTY_VAR = '   ';
        expect(() => getEnvVariable('EMPTY_VAR')).toThrow(EnvVarError);
        expect(() => getEnvVariable('EMPTY_VAR')).toThrow('Environment variable EMPTY_VAR is set but empty.');
    });
});
