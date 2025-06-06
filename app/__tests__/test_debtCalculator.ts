import { calculateSettlements } from '../lib/debtCalculator';
import { Person } from '../types';

describe('calculateSettlements', () => {
  it('returns empty array when given no people', () => {
    expect(calculateSettlements([])).toEqual([]);
  });

  it('returns no settlements if everyone paid equally', () => {
    const people: Person[] = [
      { id: '1', name: 'Alice', items: [{ id: 'a1', name: 'Water', value: 50 }] },
      { id: '2', name: 'Bob', items: [{ id: 'b1', name: 'Juice', value: 50 }] },
    ];

    expect(calculateSettlements(people)).toEqual([]);
  });

  it('calculates simple settlement between two people', () => {
    const people: Person[] = [
      { id: '1', name: 'Alice', items: [{ id: 'a1', name: 'Pizza', value: 100 }] },
      { id: '2', name: 'Bob', items: [] },
    ];

    expect(calculateSettlements(people)).toEqual([
      { from: 'Bob', to: 'Alice', amount: 50 },
    ]);
  });

  it('handles service tax correctly', () => {
    const people: Person[] = [
      {
        id: '1',
        name: 'Alice',
        items: [{ id: 'a1', name: 'Dinner', value: 100, serviceTaxPercent: 10 }], // 110 total
      },
      {
        id: '2',
        name: 'Bob',
        items: [{ id: 'b1', name: 'Drinks', value: 50 }],
      },
    ];

    expect(calculateSettlements(people)).toEqual([
      { from: 'Bob', to: 'Alice', amount: 30 },
    ]);
  });

  it('handles multiple people with uneven spending', () => {
    const people: Person[] = [
      { id: '1', name: 'Alice', items: [{ id: 'a1', name: 'Steak', value: 120 }] },
      { id: '2', name: 'Bob', items: [{ id: 'b1', name: 'Burger', value: 60 }] },
      { id: '3', name: 'Carol', items: [] },
    ];

    expect(calculateSettlements(people)).toEqual([
      { from: 'Carol', to: 'Alice', amount: 60 },
    ]);
  });

  it('ignores tiny floating point differences (tolerance)', () => {
    const people: Person[] = [
      { id: '1', name: 'Alice', items: [{ id: 'a1', name: 'Apple', value: 33.3333 }] },
      { id: '2', name: 'Bob', items: [{ id: 'b1', name: 'Banana', value: 33.3333 }] },
      { id: '3', name: 'Carol', items: [{ id: 'c1', name: 'Coke', value: 33.3334 }] },
    ];

    expect(calculateSettlements(people)).toEqual([]);
  });

  it('calculates settlements when one person paid for everything', () => {
  const people: Person[] = [
    { id: '1', name: 'Alice', items: [{ id: 'a1', name: 'Pizza', value: 100 }, { id: 'a2', name: 'Soda', value: 50 }] }, // Paid 150 total
    { id: '2', name: 'Bob', items: [] },
    { id: '3', name: 'Carol', items: [] },
  ];

  expect(calculateSettlements(people)).toEqual([
    { from: 'Bob', to: 'Alice', amount: 50 },
    { from: 'Carol', to: 'Alice', amount: 50 },
  ]);
});
});
