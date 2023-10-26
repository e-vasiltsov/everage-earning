import { Currency } from './interfaces/currency.type';
import { AlphAvantageProvider } from './providers/alphavantage/alphavantage.provider';

const stockmarketApi = new AlphAvantageProvider();

export const calculateAverageEarnings = async (
    setOfCurrencies: Currency[],
    targetCurrency: Currency,
): Promise<{ average: number; currency: Currency }> => {
    const earnings = await stockmarketApi.fetchEarnings();

    earnings.filterInvalidDataAndCurrencies(setOfCurrencies).groupByCompanyByLatestRecord();

    const uniqueCurrencies = earnings.getCurrencies().unique().values();

    const currenciesExchangeRatesObj = await stockmarketApi.getCurrenciesExchangeRatesObj(
        uniqueCurrencies,
        targetCurrency,
    );

    earnings.modifyCurrencyAndEstimate(currenciesExchangeRatesObj, targetCurrency);

    const average = earnings.getEstimates().averageEstimate();

    return {
        average: average,
        currency: targetCurrency,
    };
};
