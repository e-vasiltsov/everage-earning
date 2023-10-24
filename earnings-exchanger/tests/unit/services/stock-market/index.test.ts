import { calculateAverageEarnings } from '../../../../services/stock-market/';
import { AlphAvantageProvider } from '../../../../services/stock-market/providers/alphavantage/alphavantage.provider';
import { EarningsData } from '../../../../services/stock-market/providers/alphavantage/earnings-data';

jest.mock('../../../../services/stock-market/providers/alphavantage/alphavantage.service');

describe('calculateAverageEarnings', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should calculate average earnings for given set of currencies and convert to target currency', async () => {
        // Mock earnings data:
        const mockEarningsData = [
            {
                symbol: 'AAPL',
                name: 'Apple',
                reportDate: '2022-06-01',
                fiscalDateEnding: '2022-05-31',
                estimate: 100.5,
                currency: 'USD',
            },
            {
                symbol: 'MSFT',
                name: 'Microsoft',
                reportDate: '2022-06-15',
                fiscalDateEnding: '2022-05-28',
                estimate: 75,
                currency: 'USD',
            },
            {
                symbol: 'BMW',
                name: 'BMW AG',
                reportDate: '2022-06-18',
                fiscalDateEnding: '2022-05-30',
                estimate: 80,
                currency: 'EUR',
            },
            {
                symbol: 'TSLA',
                name: 'Tesla',
                reportDate: '2022-06-20',
                fiscalDateEnding: '2022-06-01',
                estimate: 150.25,
                currency: 'USD',
            },
        ];

        // Mock exchange rates:
        const mockExchangeRates = {
            USD: 0.75, // Example: 1 USD = 0.75 GBP
            EUR: 0.85, // Example: 1 EUR = 0.85 GBP
        };

        (AlphAvantageProvider.prototype.fetchEarnings as jest.Mock).mockResolvedValueOnce(
            new EarningsData(mockEarningsData),
        );
        (AlphAvantageProvider.prototype.getCurrenciesExchangeRatesObj as jest.Mock).mockResolvedValueOnce(
            mockExchangeRates,
        );

        // Executing the function:
        const result = await calculateAverageEarnings(['USD', 'EUR'], 'GBP');

        // Expected average calculation:
        // (100.50 * 0.75) + (75 * 0.75) + (80 * 0.85) + (150.25 * 0.75) / 4
        const expectedAverage = (100.5 * 0.75 + 75 * 0.75 + 80 * 0.85 + 150.25 * 0.75) / 4;

        // Check the result:
        expect(result).toEqual({
            average: parseFloat(expectedAverage.toFixed(2)),
            currency: 'GBP',
        });
    });
});
