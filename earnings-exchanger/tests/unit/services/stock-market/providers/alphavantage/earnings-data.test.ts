import { EarningsData } from '../../../../../../services/stock-market/providers/alphavantage/earnings-data';
import { Currencies } from '../../../../../../services/stock-market/providers/alphavantage/currencies';
import { Estimates } from '../../../../../../services/stock-market/providers/alphavantage/estimates';
import { EarningsRecord } from '../../../../../../services/stock-market/providers/alphavantage/interfaces/earnings-record.interface';

const sampleData = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        reportDate: '2023-04-05',
        fiscalDateEnding: '2023-03-31',
        estimate: 5,
        currency: 'USD',
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        reportDate: '2023-04-05',
        fiscalDateEnding: '2023-03-31',
        estimate: 10,
        currency: 'EUR',
    },
];

describe('EarningsData', () => {
    it('should return values', () => {
        const earningsData = new EarningsData(sampleData);
        expect(earningsData.values()).toEqual(sampleData);
    });

    describe('getCurrencies', () => {
        it('should get Currencies', () => {
            const earningsData = new EarningsData(sampleData);
            expect(earningsData.getCurrencies()).toBeInstanceOf(Currencies);
        });
    });

    describe('getEstimates', () => {
        it('should get Estimates', () => {
            const earningsData = new EarningsData(sampleData);
            expect(earningsData.getEstimates()).toBeInstanceOf(Estimates);
        });
    });

    describe('filterInvalidDataAndCurrencies', () => {
        it('should remove records with NaN estimates', () => {
            const records: EarningsRecord[] = [
                {
                    symbol: 'A',
                    name: 'Company A',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: NaN,
                    currency: 'USD',
                },
                {
                    symbol: 'B',
                    name: 'Company B',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 150,
                    currency: 'USD',
                },
            ];

            const earningsData = new EarningsData(records);
            earningsData.filterInvalidDataAndCurrencies(['USD']);

            expect(earningsData.values()).toEqual([records[1]]);
        });

        it('should remove records that do not match allowed currencies', () => {
            const records: EarningsRecord[] = [
                {
                    symbol: 'A',
                    name: 'Company A',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: 100,
                    currency: 'EUR',
                },
                {
                    symbol: 'B',
                    name: 'Company B',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 150,
                    currency: 'USD',
                },
            ];

            const earningsData = new EarningsData(records);
            earningsData.filterInvalidDataAndCurrencies(['USD']);

            expect(earningsData.values()).toEqual([records[1]]);
        });

        it('should leave valid records untouched', () => {
            const records: EarningsRecord[] = [
                {
                    symbol: 'A',
                    name: 'Company A',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: 100,
                    currency: 'USD',
                },
                {
                    symbol: 'B',
                    name: 'Company B',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 150,
                    currency: 'USD',
                },
            ];

            const earningsData = new EarningsData(records);
            earningsData.filterInvalidDataAndCurrencies(['USD']);

            expect(earningsData.values()).toEqual(records);
        });
    });

    describe('groupByCompanyByLatestRecord', () => {
        it('should keep only the latest record for each company based on fiscalDateEnding', () => {
            const records: EarningsRecord[] = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: 100,
                    currency: 'USD',
                },
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 105,
                    currency: 'USD',
                },
                {
                    symbol: 'MSFT',
                    name: 'Microsoft',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 150,
                    currency: 'USD',
                },
                {
                    symbol: 'MSFT',
                    name: 'Microsoft',
                    reportDate: '2022-10-03',
                    fiscalDateEnding: '2022-09-28',
                    estimate: 152,
                    currency: 'USD',
                },
            ];

            const earningsData = new EarningsData(records);
            earningsData.groupByCompanyByLatestRecord();

            const expected = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: 100,
                    currency: 'USD',
                },
                {
                    symbol: 'MSFT',
                    name: 'Microsoft',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 150,
                    currency: 'USD',
                },
            ];

            expect(earningsData.values()).toEqual(expected);
        });

        it('should work correctly even if records are not in chronological order', () => {
            const records: EarningsRecord[] = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 105,
                    currency: 'USD',
                },
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: 100,
                    currency: 'USD',
                },
            ];

            const earningsData = new EarningsData(records);
            earningsData.groupByCompanyByLatestRecord();

            const expected = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: 100,
                    currency: 'USD',
                },
            ];

            expect(earningsData.values()).toEqual(expected);
        });
    });

    describe('modifyCurrencyAndEstimate', () => {
        it('should modify the currency and estimate values based on provided exchange rates', () => {
            const records: EarningsRecord[] = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: 100,
                    currency: 'USD',
                },
                {
                    symbol: 'MSFT',
                    name: 'Microsoft',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 105,
                    currency: 'EUR',
                },
            ];

            const exchangeRates = { USD: 0.85, EUR: 1 }; // Suppose 1 USD = 0.85 EUR
            const targetCurrency = 'EUR';

            const earningsData = new EarningsData(records);
            earningsData.modifyCurrencyAndEstimate(exchangeRates, targetCurrency);

            const expected = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-01',
                    fiscalDateEnding: '2022-09-30',
                    estimate: 85,
                    currency: 'EUR',
                },
                {
                    symbol: 'MSFT',
                    name: 'Microsoft',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 105,
                    currency: 'EUR',
                },
            ];

            expect(earningsData.values()).toEqual(expected);
        });

        it('should not modify the estimate for records that are already in the target currency', () => {
            const records: EarningsRecord[] = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 105,
                    currency: 'EUR',
                },
            ];

            const exchangeRates = { USD: 0.85, EUR: 1 };
            const targetCurrency = 'EUR';

            const earningsData = new EarningsData(records);
            earningsData.modifyCurrencyAndEstimate(exchangeRates, targetCurrency);

            const expected = [
                {
                    symbol: 'AAPL',
                    name: 'Apple',
                    reportDate: '2022-10-02',
                    fiscalDateEnding: '2022-09-29',
                    estimate: 105,
                    currency: 'EUR',
                },
            ];

            expect(earningsData.values()).toEqual(expected);
        });
    });
});
