import { Currencies } from '../../../../../../services/stock-market/providers/alphavantage/currencies';

describe('Currencies', () => {
    describe('unique', () => {
        it('should remove duplicates', () => {
            const currencies = new Currencies(['USD', 'EUR', 'USD', 'JPY', 'JPY']);
            currencies.unique();

            expect(currencies.values()).toEqual(['USD', 'EUR', 'JPY']);
        });

        it('should handle an array without duplicates', () => {
            const currencies = new Currencies(['USD', 'EUR', 'JPY']);
            currencies.unique();

            expect(currencies.values()).toEqual(['USD', 'EUR', 'JPY']);
        });
    });

    describe('values', () => {
        it('should return the array of currencies', () => {
            const currencies = new Currencies(['USD', 'EUR', 'JPY']);

            expect(currencies.values()).toEqual(['USD', 'EUR', 'JPY']);
        });
    });
});
