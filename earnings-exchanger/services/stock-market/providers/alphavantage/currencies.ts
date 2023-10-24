export class Currencies {
    constructor(private arrayCurrencies: string[]) {}

    unique() {
        this.arrayCurrencies = [...new Set(this.arrayCurrencies)];
        return this;
    }

    values() {
        return this.arrayCurrencies;
    }
}
