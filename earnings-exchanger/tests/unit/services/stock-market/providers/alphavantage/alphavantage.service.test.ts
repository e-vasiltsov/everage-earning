import { Readable } from 'stream';
import { IncomingMessage } from 'http';

import { httpClient } from '../../../../../../utils/http-client';
import { AlphAvantageProvider } from '../../../../../../services/stock-market/providers/alphavantage/alphavantage.provider';
import { AVCurrencyExchangeRangeError } from '../../../../../../services/stock-market/providers/alphavantage/exceptions/av-currency-exhange-rate.exception';
import { AVCurrencyExchangeRangeDataStructureError } from '../../../../../../services/stock-market/providers/alphavantage/exceptions/av-currency-exhange-rate-data-stracture.exception copy';
import { AVCurrencyExchangeObjError } from '../../../../../../services/stock-market/providers/alphavantage/exceptions/av-currency-exhange-obj.exception';
import { AVFetchErningsError } from '../../../../../../services/stock-market/providers/alphavantage/exceptions/av-fetch-ernings.exception';
import { EarningsData } from '../../../../../../services/stock-market/providers/alphavantage/earnings-data';

jest.mock('../../../../../../utils/http-client');
jest.mock('../../../../../../utils/logger');

describe('AlphAvantageProvider', () => {
    let service: AlphAvantageProvider;

    const createReadableMock = (data: string) => {
        const readable = new Readable() as IncomingMessage;
        readable.push(data);
        readable.push(null);
        return readable;
    };

    beforeEach(() => {
        service = new AlphAvantageProvider();
        (httpClient.get as jest.Mock).mockClear();
    });

    describe('getExchangeRate', () => {
        it('should fetch the exchange rate successfully', async () => {
            (httpClient.get as jest.Mock).mockResolvedValue({
                statusCode: 200,
                data: {
                    'Realtime Currency Exchange Rate': {
                        '5. Exchange Rate': '1.2',
                    },
                },
            });

            const rate = await service.getExchangeRate('USD', 'EUR');
            expect(rate).toBe(1.2);
        });

        it('should throw AVCurrencyExchangeRangeError on non-200 response', async () => {
            (httpClient.get as jest.Mock).mockResolvedValue({
                statusCode: 400,
                data: {},
            });

            await expect(service.getExchangeRate('USD', 'EUR')).rejects.toThrow(AVCurrencyExchangeRangeError);
        });

        it('should throw AVCurrencyExchangeRangeDataStructureError on bad data structure', async () => {
            (httpClient.get as jest.Mock).mockResolvedValue({
                statusCode: 200,
                data: {},
            });

            await expect(service.getExchangeRate('USD', 'EUR')).rejects.toThrow(
                AVCurrencyExchangeRangeDataStructureError,
            );
        });
    });

    describe('getCurrenciesExchangeRatesObj', () => {
        it('should retrieve exchange rates for all currencies', async () => {
            const mockRates = {
                USD: 1,
                EUR: 0.85,
                GBP: 0.75,
            };
            (httpClient.get as jest.Mock).mockImplementation((url: string) => {
                if (url.includes('from_currency=USD'))
                    return Promise.resolve({
                        statusCode: 200,
                        data: {
                            'Realtime Currency Exchange Rate': { '5. Exchange Rate': mockRates['USD'].toString() },
                        },
                    });
                if (url.includes('from_currency=EUR'))
                    return Promise.resolve({
                        statusCode: 200,
                        data: {
                            'Realtime Currency Exchange Rate': { '5. Exchange Rate': mockRates['EUR'].toString() },
                        },
                    });
                if (url.includes('from_currency=GBP'))
                    return Promise.resolve({
                        statusCode: 200,
                        data: {
                            'Realtime Currency Exchange Rate': { '5. Exchange Rate': mockRates['GBP'].toString() },
                        },
                    });
            });

            const result = await service.getCurrenciesExchangeRatesObj(['USD', 'EUR'], 'GBP');
            expect(result).toEqual({
                USD: mockRates['USD'],
                EUR: mockRates['EUR'],
            });
        });

        it('should throw AVCurrencyExchangeObjError if any exchange rate retrieval fails', async () => {
            (httpClient.get as jest.Mock)
                .mockResolvedValueOnce({
                    statusCode: 200,
                    data: { 'Realtime Currency Exchange Rate': { '5. Exchange Rate': '1' } },
                })
                .mockResolvedValueOnce({ statusCode: 400, data: {} }); // Simulate a failure

            await expect(service.getCurrenciesExchangeRatesObj(['USD', 'EUR'], 'GBP')).rejects.toThrow(
                AVCurrencyExchangeObjError,
            );
        });
    });

    describe('parseCSV', () => {
        it('should correctly parse a valid CSV string', async () => {
            const mockCsvStream = createReadableMock(`AAPL,Apple,2022-05-15,2022-03-31,100.50,USD
                                                     MSFT,Microsoft,2022-05-16,2022-03-31,105.0,EUR`);

            const result = await service['parseCSV'](mockCsvStream);

            const expected = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-05-15',
                    fiscalDateEnding: '2022-03-31',
                    estimate: 100.5,
                    currency: 'USD',
                },
                {
                    symbol: 'MSFT',
                    name: 'Microsoft',
                    reportDate: '2022-05-16',
                    fiscalDateEnding: '2022-03-31',
                    estimate: 105.0,
                    currency: 'EUR',
                },
            ];

            expect(result).toEqual(expected);
        });
    });

    describe('fetchEarnings', () => {
        it('should fetch earnings and return EarningsData instance', async () => {
            const mockCsvData = `AAPL,Apple,2022-05-15,2022-03-31,100.50,USD
                                 MSFT,Microsoft,2022-05-16,2022-03-31,105.0,EUR`;
            const mockResponse = {
                statusCode: 200,
                data: createReadableMock(mockCsvData),
            };

            (httpClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

            const result = await service.fetchEarnings();

            expect(result).toBeInstanceOf(EarningsData);
        });

        it('should throw AVFetchErningsError if statusCode is not 200', async () => {
            const mockResponse = {
                statusCode: 500,
                data: createReadableMock(''), // empty or irrelevant data for this test
            };

            (httpClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

            await expect(service.fetchEarnings()).rejects.toThrow(AVFetchErningsError);
        });

        it('should throw AVFetchErningsError if there is another error', async () => {
            (httpClient.get as jest.Mock).mockRejectedValueOnce(new Error('Request Timeout'));

            await expect(service.fetchEarnings()).rejects.toThrow(AVFetchErningsError);
        });
    });
});
