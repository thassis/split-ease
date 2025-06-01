'use client';
import { useState } from 'react';
import { Item } from '../types';

interface ItemFormProps {
  personId: string;
  onAddItem: (personId: string, item: Omit<Item, 'id'>) => void;
}

export default function ItemForm({ personId, onAddItem }: ItemFormProps) {
  const [itemName, setItemName] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [serviceTax, setServiceTax] = useState(''); // como string para facilitar input

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(itemValue);
    const tax = serviceTax ? parseFloat(serviceTax) : undefined;

    if (itemName.trim() && !isNaN(value) && value > 0) {
      onAddItem(personId, {
        name: itemName.trim(),
        value,
        serviceTaxPercent: tax && !isNaN(tax) ? tax : undefined,
      });
      setItemName('');
      setItemValue('');
      setServiceTax('');
    } else {
      alert("Por favor, preencha o nome e um valor válido para o item.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-gray-50 p-3 rounded">
      <h4 className="text-md font-semibold">Adicionar Item:</h4>
      <div>
        <label htmlFor={`itemName-${personId}`} className="block text-sm font-medium text-gray-700">Nome do Item</label>
        <input
          id={`itemName-${personId}`}
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Ex: Almoço"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor={`itemValue-${personId}`} className="block text-sm font-medium text-gray-700">Valor (R$)</label>
        <input
          id={`itemValue-${personId}`}
          type="number"
          value={itemValue}
          onChange={(e) => setItemValue(e.target.value)}
          placeholder="Ex: 50.00"
          min="0.01"
          step="0.01"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor={`serviceTax-${personId}`} className="block text-sm font-medium text-gray-700">Taxa de Serviço (%) (Opcional)</label>
        <input
          id={`serviceTax-${personId}`}
          type="number"
          value={serviceTax}
          onChange={(e) => setServiceTax(e.target.value)}
          placeholder="Ex: 10"
          min="0"
          step="0.1"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-sm">
        Adicionar Item
      </button>
    </form>
  );
}