import { Currency } from "./interfaces/currency.type";

export class Currencies {
    constructor(private arrayCurrencies: Currency[]) {}

    unique() {
        this.arrayCurrencies = [...new Set(this.arrayCurrencies)];
        return this;
    }

    values(): Currency[] {
        return this.arrayCurrencies;
    }
}
