import { range, pluck } from './utils';

describe('utils', () => {
  describe('range', () => {
    it('returns correct result for 1-6 range', () => {
      expect(range(1, 6)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('returns correct result for 21-26 range', () => {
      expect(range(21, 26)).toEqual([21, 22, 23, 24, 25, 26]);
    });
  });

  describe('pluck', () => {
    it('returns correct result ', () => {
      const data = [
        { id: 1, name: 'test' },
        { id: 2, name: 'tst' },
        { id: 3, name: 'testt' },
      ];

      expect(pluck(data, 'name')).toEqual(['test', 'tst', 'testt']);
    });
  });
});
