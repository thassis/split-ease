'use client';
import { Settlement, Person } from '../types';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const calculateTotalSpentByPerson = (person: Person): number => {
  return person.items.reduce((sum, item) => {
    let totalForItem = item.value;
    if (item.serviceTaxPercent && item.serviceTaxPercent > 0) {
      totalForItem += item.value * (item.serviceTaxPercent / 100);
    }
    return sum + totalForItem;
  }, 0);
};


interface ResultsDisplayProps {
  settlements: Settlement[];
  people: Person[]; // Adicionado para mostrar o resumo
}

export default function ResultsDisplay({ settlements, people }: ResultsDisplayProps) {
  if (settlements.length === 0 && people.length < 2) {
    return null; // Não mostra nada se não houver acertos ou pessoas suficientes
  }

  const totalOverallSpent = people.reduce((sum, person) => sum + calculateTotalSpentByPerson(person), 0);
  const averageCostPerPerson = people.length > 0 ? totalOverallSpent / people.length : 0;


  return (
    <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Resultados da Divisão 📊</h2>

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Resumo Geral:</h3>
        <p><strong>Total Gasto por Todos:</strong> {formatCurrency(totalOverallSpent)}</p>
        <p><strong>Número de Pessoas:</strong> {people.length}</p>
        <p><strong>Custo Médio por Pessoa:</strong> {formatCurrency(averageCostPerPerson)}</p>
      </div>


      {settlements.length === 0 && people.length >=2 && (
        <p className="text-center text-green-600 font-semibold">🎉 Todos gastaram valores equivalentes ou a divisão está zerada! Não há pagamentos pendentes.</p>
      )}


      {settlements.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-3">Quem Paga Quem:</h3>
          <ul className="space-y-2">
            {settlements.map((settlement, index) => (
              <li key={index} className="p-3 bg-white rounded shadow-sm border border-gray-200">
                <span className="font-medium text-red-600">{settlement.from}</span> deve pagar{' '}
                <span className="font-bold text-green-700">{formatCurrency(settlement.amount)}</span> para{' '}
                <span className="font-medium text-blue-600">{settlement.to}</span>.
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}