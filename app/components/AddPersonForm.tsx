'use client';
import { useState } from 'react';

interface AddPersonFormProps {
  onAddPerson: (name: string) => void;
}

export default function AddPersonForm({ onAddPerson }: AddPersonFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPerson(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6 p-4 bg-gray-100 rounded-lg shadow">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome da Pessoa"
        className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Adicionar Pessoa
      </button>
    </form>
  );
}