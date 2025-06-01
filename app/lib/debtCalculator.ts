import { Person, Settlement } from '../types';

// Função auxiliar para calcular o total gasto por uma pessoa, incluindo taxa
const calculatePersonTotal = (person: Person): number => {
  return person.items.reduce((sum, item) => {
    let itemTotal = item.value;
    if (item.serviceTaxPercent && item.serviceTaxPercent > 0) {
      itemTotal += item.value * (item.serviceTaxPercent / 100);
    }
    return sum + itemTotal;
  }, 0);
};

export const calculateSettlements = (people: Person[]): Settlement[] => {
  if (people.length === 0) return [];

  const balances: { name: string; amount: number }[] = people.map((person) => ({
    name: person.name,
    amount: calculatePersonTotal(person),
  }));

  const totalSpent = balances.reduce((sum, p) => sum + p.amount, 0);
  const averageSpent = totalSpent / people.length;

  // Ajustar os saldos para mostrar quanto cada um deve ou vai receber em relação à média
  const adjustedBalances = balances.map((p) => ({
    name: p.name,
    // Se positivo, a pessoa pagou a mais e deve receber.
    // Se negativo, a pessoa pagou a menos e deve pagar.
    amount: p.amount - averageSpent,
  }));

  // Separar devedores e credores
  // Usar uma pequena tolerância para evitar problemas com ponto flutuante
  const tolerance = 0.001;
  const debtors = adjustedBalances.filter((p) => p.amount < -tolerance);
  const creditors = adjustedBalances.filter((p) => p.amount > tolerance);

  const settlements: Settlement[] = [];

  // Ordenar para otimizar (opcional, mas pode levar a menos transações em alguns casos)
  // Devedores: quem deve mais primeiro (do menor negativo para perto de zero)
  debtors.sort((a, b) => a.amount - b.amount);
  // Credores: quem tem mais a receber primeiro (do maior positivo para perto de zero)
  creditors.sort((a, b) => b.amount - a.amount);


  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const amountToTransfer = Math.min(-debtor.amount, creditor.amount);

    if (amountToTransfer > tolerance) { // Só registra se for um valor significativo
        settlements.push({
            from: debtor.name,
            to: creditor.name,
            amount: amountToTransfer,
        });
    }


    debtor.amount += amountToTransfer;
    creditor.amount -= amountToTransfer;

    if (Math.abs(debtor.amount) < tolerance) {
      debtorIndex++;
    }
    if (Math.abs(creditor.amount) < tolerance) {
      creditorIndex++;
    }
  }

  return settlements;
};