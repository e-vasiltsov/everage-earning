import { ExchangeRate } from '../../interfaces/exchange-rate.type';
import { Currency } from './interfaces/currency.type';

/**
 * Represents an object where each key is a currency symbol and
 * its corresponding value is the exchange rate for that currency.
 *
 * @interface
 * @example
 * {
 *    "USD": 1.0,
 *    "EUR": 0.85
 * }
 */
export interface CurrenciesExchangeRatesObj {
    [key: Currency]: ExchangeRate;
}
