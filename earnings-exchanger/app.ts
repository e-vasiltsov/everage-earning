import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { handleErrors } from './utils/error-handler';
import * as stockMarketAPI from './services/stock-market';
import { getAverageEarningSchema } from './utils/validators';
import { Currency } from './services/stock-market/interfaces/currency.type';
import { Logger } from './utils/logger';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { queryStringParameters } = event;

        Logger.debug('lambdaHandler:start', { queryStringParameters });

        const { cur, targetCur } = <{ cur: string; targetCur: Currency }>(
            await getAverageEarningSchema.validate(queryStringParameters)
        );

        const currencies: string[] = cur.split(',');

        const averageEarning = await stockMarketAPI.calculateAverageEarnings(currencies, targetCur);

        Logger.debug('lambdaHandler:finished', { averageEarning });
        return {
            statusCode: 200,
            body: JSON.stringify(averageEarning),
        };
    } catch (err) {
        return handleErrors(err);
    }
};
