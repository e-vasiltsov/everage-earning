import * as yup from 'yup';
import { allCurrencies } from './currencies-all';

export const getAverageEarningSchema = yup.object().shape({
    cur: yup
        .string()
        .test(
            'is-comma-separated',
            'cur must be a comma-separated string',
            (value) => typeof value === 'string' && !!value,
        )
        .test('are-valid-currencies', 'cur contains invalid currency/currencies', (value) => {
            if (!value) return false;
            const currencyArray = value.split(',');
            return currencyArray.every((currency) => allCurrencies.includes(currency.trim()));
        }),
    targetCur: yup
        .string()
        .oneOf(allCurrencies, '${path} is not a valid currency')
        .required('targetCur is a required field'),
});
