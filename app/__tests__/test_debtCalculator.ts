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

  it('calculates simple settlement between five people', () => {
  const people: Person[] = [
    { id: '1', name: 'Alice', items: [{ id: 'a1', name: 'Bife', value: 150 }] },
    { id: '2', name: 'Bob', items: [{id: 'b1', name: 'Hambúrguer', value: 50}] },
    { id: '3', name: 'Carol', items: [{id: 'c1', name: 'Refrigerante', value: 10}]},
    { id: '4', name: 'David', items: [{id: 'd1', name: 'Macarrão', value: 100}]},
    { id: '5', name: 'Eve', items:  [{id: 'e1', name: 'Sanduíche', value: 15}]},
  ];

  expect(calculateSettlements(people)).toEqual([
    { from: 'Carol', to: 'Alice', amount: 55 },
    { from: 'Eve', to: 'Alice', amount: 30 },
    { from: 'Eve', to: 'David', amount: 20},
    { from: 'Bob', to: 'David', amount: 15},
  ]);
});

  it('calculates simple settlement between 10 people', () => {
  const people: Person[] = [
    { id: '1', name: 'Alice', items: [{ id: 'a1', name: 'Bife', value: 150 }] },
    { id: '2', name: 'Bob', items: [{id: 'b1', name: 'Hambúrguer', value: 50}] },
    { id: '3', name: 'Carol', items: [{id: 'c1', name: 'Refrigerante', value: 10}]},
    { id: '4', name: 'David', items: [{id: 'd1', name: 'Macarrão', value: 100}]},
    { id: '5', name: 'Eve', items:  [{id: 'e1', name: 'Sanduíche', value: 15}]},
    { id: '6', name: 'Frank', items:  [{id: 'f1', name: 'Salada', value: 30}]},
    { id: '7', name: 'Grace', items:  [{id: 'g1', name: 'Espetinho', value: 20}]},
    { id: '8', name: 'Hank', items:  [{id: 'h1', name: 'Sushi', value: 120}]},
    { id: '9', name: 'Ivy', items:  [{id: 'i1', name: 'Sopa', value: 50}]},
    { id: '10', name: 'Jack', items:  [{id: 'j1', name: 'Tamagoyaki', value: 45}]},
  ];

  expect(calculateSettlements(people)).toEqual([
    { from: 'Carol', to: 'Alice', amount: 49 },
    { from: 'Eve', to: 'Alice', amount: 42 },
    { from: 'Eve', to: 'Hank', amount: 2},
    { from: 'Grace', to: 'Hank', amount: 39},
    { from: 'Frank', to: 'Hank', amount: 20},
    { from: 'Frank', to: 'David', amount: 9},
    { from: 'Jack', to: 'David', amount: 14},
    { from: 'Bob', to: 'David', amount: 9},
    { from: 'Ivy', to: 'David', amount: 9},
  ]);
});
});
