import { getInsights } from '../Insights';

describe('src/utils/Insights', () => {
    it('should resolve once insights is set', async () => {
        jest.useFakeTimers();
        const insights = getInsights();
        (global as any).insights = { chrome: { isProd: true }};
        jest.runAllTimers();
        return insights.then(insights => {
            expect(insights.chrome.isProd).toEqual(true);
        });
    });
});
