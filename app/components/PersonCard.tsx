'use client';
import { Person, Item } from '../types';
import ItemForm from './ItemForm';

interface PersonCardProps {
  person: Person;
  onAddItem: (personId: string, item: Omit<Item, 'id'>) => void;
  onDeleteItem: (personId: string, itemId: string) => void;
  onDeletePerson: (personId: string) => void;
}

// Função auxiliar para formatar moeda
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function PersonCard({ person, onAddItem, onDeleteItem, onDeletePerson }: PersonCardProps) {
  const calculateTotalForItem = (item: Item): number => {
    let total = item.value;
    if (item.serviceTaxPercent && item.serviceTaxPercent > 0) {
      total += item.value * (item.serviceTaxPercent / 100);
    }
    return total;
  };

  const totalSpentByPerson = person.items.reduce(
    (sum, item) => sum + calculateTotalForItem(item),
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-blue-600">{person.name}</h3>
        <button
          onClick={() => onDeletePerson(person.id)}
          className="text-red-500 hover:text-red-700 text-xs"
          title="Excluir Pessoa"
        >
          🗑️ Excluir Pessoa
        </button>
      </div>


      <ul className="space-y-2 mb-3">
        {person.items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
            <div>
              <span className="font-medium">{item.name}</span>: {formatCurrency(item.value)}
              {item.serviceTaxPercent && ` (+${item.serviceTaxPercent}% taxa = ${formatCurrency(calculateTotalForItem(item))})`}
            </div>
            <button onClick={() => onDeleteItem(person.id, item.id)} className="text-red-400 hover:text-red-600 text-xs">
              ✖
            </button>
          </li>
        ))}
        {person.items.length === 0 && <p className="text-gray-500 text-sm">Nenhum item adicionado.</p>}
      </ul>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-lg font-bold text-right">
          Total Gasto: <span className="text-green-600">{formatCurrency(totalSpentByPerson)}</span>
        </p>
      </div>

      <ItemForm personId={person.id} onAddItem={onAddItem} />
    </div>
  );
}