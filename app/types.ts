// Em um arquivo como app/types.ts ou no topo de app/page.tsx

export interface Item {
  id: string;
  name: string;
  value: number;
  serviceTaxPercent?: number; // Taxa de serviço em porcentagem (ex: 10 para 10%)
}

export interface Person {
  id: string;
  name: string;
  items: Item[];
}

export interface Settlement {
  from: string; // Nome da pessoa que deve
  to: string;   // Nome da pessoa que recebe
  amount: number;
}