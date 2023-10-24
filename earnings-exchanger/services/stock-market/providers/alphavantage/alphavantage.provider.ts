import { StringStream } from 'scramjet';
import { IncomingMessage } from 'http';

import { getEnvVariable } from '../../../../utils/config';
import { httpClient } from '../../../../utils/http-client';
import { AVFetchErningsError } from './exceptions/av-fetch-ernings.exception';
import { EarningsRecord } from './interfaces/earnings-record.interface';
import { EarningsData } from './earnings-data';
import { Currency } from './interfaces/currency.type';
import { CurrencyExchangeResponse } from './interfaces/currency-exchange-response.interface';
import { ExchangeRate } from '../../interfaces/exchange-rate.type';
import { Logger } from '../../../../utils/logger';
import { AVCurrencyExchangeRangeError } from './exceptions/av-currency-exhange-rate.exception';
import { AVCurrencyExchangeRangeDataStructureError } from './exceptions/av-currency-exhange-rate-data-stracture.exception copy';
import { AVCurrencyExchangeObjError } from './exceptions/av-currency-exhange-obj.exception';
import { AVCsvParseError } from './exceptions/av-csv-parse.exception';
import { CurrenciesExchangeRatesObj } from './currencies-exchange-rates-obj.interface';

const API_URL = getEnvVariable('ALPHAVANTAGE_API_URL');
const API_KEY = getEnvVariable('ALPHAVANTAGE_API_KEY');

export class AlphAvantageProvider {
    async fetchEarnings(): Promise<EarningsData> {
        try {
            Logger.debug('AlphAvantageProvider.fetchEarnings:start');
            const response = await httpClient.get(
                `${API_URL}/query?function=EARNINGS_CALENDAR&horizon=3month&apikey=${API_KEY}`,
                { responseType: 'stream' },
            );

            if (response.statusCode !== 200) {
                Logger.error('AlphAvantageProvider.response', response);
                throw new AVFetchErningsError('Error fetching earnings data');
            }

            const csvStream: IncomingMessage = response.data;

            Logger.debug('AlphAvantageProvider.fetchEarnings:fetched');

            const earnings = await this.parseCSV(csvStream);

            Logger.debug('AlphAvantageProvider.fetchEarnings:finished');

            return new EarningsData(earnings);
        } catch (error) {
            throw new AVFetchErningsError('AlphAvantageProvider.fetchEarnings', error as Error);
        }
    }

    async getExchangeRate(fromCurrency: Currency, toCurrency: Currency): Promise<number> {
        Logger.debug('AlphAvantageProvider.getExchangeRate:start', { fromCurrency, toCurrency });

        const url = `${API_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${API_KEY}`;
        const response = await httpClient.get(url);
        if (response.statusCode !== 200) {
            Logger.error('AlphAvantageProvider.getExchangeRate', response);
            throw new AVCurrencyExchangeRangeError('An error while fetching CURRENCY EXCHANGE RATE');
        }

        const currencyExchange: CurrencyExchangeResponse = response.data;

        if (
            !currencyExchange ||
            !currencyExchange['Realtime Currency Exchange Rate'] ||
            !currencyExchange['Realtime Currency Exchange Rate']['5. Exchange Rate']
        ) {
            Logger.error('AlphAvantageProvider.getExchangeRate: Invalid data structure', currencyExchange);
            throw new AVCurrencyExchangeRangeDataStructureError('Invalid data structure received');
        }

        const exchangeRate = parseFloat(currencyExchange['Realtime Currency Exchange Rate']['5. Exchange Rate']);

        Logger.debug('AlphAvantageProvider.getExchangeRate:finished');

        return exchangeRate;
    }

    async getCurrenciesExchangeRatesObj(
        currencies: Currency[],
        targetCurrency: Currency,
    ): Promise<CurrenciesExchangeRatesObj> {
        Logger.debug('AlphAvantageProvider.getCurrenciesExchangeRatesObj:start');
        // remove target currency
        const filteredCurrency = currencies.filter((currency) => currency !== targetCurrency);

        try {
            const getExchangeRatePromise = filteredCurrency.map((crrency) =>
                this.getExchangeRate(crrency, targetCurrency),
            );
            const exchangeRates = <ExchangeRate[]>await Promise.all(getExchangeRatePromise);

            Logger.debug('AlphAvantageProvider.getCurrenciesExchangeRatesObj:finished');

            return filteredCurrency.reduce((acc, cur, index) => {
                acc[cur] = exchangeRates[index];
                return acc;
            }, {} as CurrenciesExchangeRatesObj);
        } catch (error) {
            Logger.error('AlphAvantageProvider.getCurrenciesExchangeRatesObj', error);
            throw new AVCurrencyExchangeObjError('an error while getting object of currencies rates');
        }
    }

    private async parseCSV(csvStream: IncomingMessage): Promise<EarningsRecord[]> {
        Logger.debug('AlphAvantageProvider.parseCSV:start');

        try {
            return <EarningsRecord[]>await StringStream.from(csvStream)
                .lines()
                .parse((line) => {
                    const [symbol, name, reportDate, fiscalDateEnding, estimate, currency] = line
                        .split(',')
                        .map((value) => value.trim());
                    return {
                        symbol,
                        name,
                        reportDate,
                        fiscalDateEnding,
                        estimate: parseFloat(estimate),
                        currency,
                    };
                })
                .toArray();
        } catch (error) {
            Logger.error('AlphAvantageProvider.parseCSV:error', error);
            throw new AVCsvParseError('an error while parsing csv string');
        }
    }
}
