import { Currencies } from './currencies';
import { Estimates } from './estimates';
import { Currency } from './interfaces/currency.type';
import { EarningsRecord } from './interfaces/earnings-record.interface';

export class EarningsData {
    constructor(private records: EarningsRecord[]) {}

    values() {
        return this.records;
    }

    getCurrencies() {
        const currencies = this.values().map((record) => record.currency);
        return new Currencies(currencies);
    }

    getEstimates() {
        const estimates = this.values().map((record) => record.estimate);

        return new Estimates(estimates);
    }

    modifyCurrencyAndEstimate(currenciesExchangeRatesObj: { [key: Currency]: number }, targetCurrency: Currency) {
        this.records = this.records.map((record) => {
            if (record.currency !== targetCurrency) {
                const convertedEstimate = record.estimate * currenciesExchangeRatesObj[record.currency];
                record.estimate = convertedEstimate;
                record.currency = targetCurrency; // Update the currency to the target currency
            }
            return record;
        });

        return this;
    }

    filterInvalidDataAndCurrencies(allowedCurrencies: Currency[]) {
        this.records = this.records.filter((record) => {
            return (
                record.estimate && // remove NaN value
                allowedCurrencies.includes(record.currency)
            );
        });

        return this;
    }

    groupByCompanyByLatestRecord() {
        // Group by company symbol and select the latest record for each company
        const latestRecords = this.records.reduce((acc: any, curr: any) => {
            if (!acc[curr.symbol] || new Date(acc[curr.symbol].fiscalDateEnding) < new Date(curr.fiscalDateEnding)) {
                acc[curr.symbol] = curr;
            }
            return acc;
        }, {});

        this.records = Object.values(latestRecords);

        return this;
    }
}
