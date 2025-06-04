export interface Item {
  id: string;
  name: string;
  value: number;
  serviceTaxPercent?: number;
}

export interface Person {
  id: string;
  name: string;
  items: Item[];
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface SplitEaseDocument {
  _id: string;
  shareId: string;
  createdAt: Date;
  updatedAt: Date;
  people: Person[];
  items: Item[];
  settlements: Settlement[];
}
