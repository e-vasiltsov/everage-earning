import { Estimates } from '../../../../../../services/stock-market/providers/alphavantage/estimates';

describe('Estimates', () => {
    const sampleEstimates = [10, 20, 30, 40, 50];
    const estimatesInstance = new Estimates(sampleEstimates);

    it('should compute average estimate correctly', () => {
        expect(estimatesInstance.averageEstimate()).toBe(30);
    });

    it('should compute sum of estimates correctly', () => {
        expect(estimatesInstance.sum()).toBe(150);
    });

    it('should return values correctly', () => {
        expect(estimatesInstance.values()).toEqual(sampleEstimates);
    });
});
