export class Estimates {
    constructor(private estimates: number[]) {}

    sum() {
        return this.estimates.reduce((acc, current) => acc + current, 0);
    }

    averageEstimate() {
        return parseFloat((this.sum() / this.estimates.length).toFixed(2));
    }

    values() {
        return this.estimates;
    }
}
