'use client'; // Necessário para interatividade no App Router

import { useState } from 'react';
import { Person, Item, Settlement } from './types'; // Supondo que você criou types.ts
import AddPersonForm from './components/AddPersonForm';
import PersonCard from './components/PersonCard';
import ResultsDisplay from './components/ResultsDisplay';
import { calculateSettlements } from './lib/debtCalculator'; // Lógica de cálculo

export default function DebtOrganizerPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const addPerson = (name: string) => {
    if (name.trim() === '') return; // Evita nomes vazios
    const newPerson: Person = {
      id: crypto.randomUUID(), // ID único
      name,
      items: [],
    };
    setPeople([...people, newPerson]);
  };

  const addItemToPerson = (personId: string, item: Omit<Item, 'id'>) => {
    const newItem: Item = { ...item, id: crypto.randomUUID() };
    setPeople(
      people.map((person) =>
        person.id === personId
          ? { ...person, items: [...person.items, newItem] }
          : person
      )
    );
    setShowResults(false); // Esconde resultados antigos se novos itens forem adicionados
  };

  const deleteItem = (personId: string, itemId: string) => {
    setPeople(
      people.map((person) =>
        person.id === personId
          ? { ...person, items: person.items.filter((item) => item.id !== itemId) }
          : person
      )
    );
    setShowResults(false);
  };

  const deletePerson = (personId: string) => {
    setPeople(people.filter((person) => person.id !== personId));
    setShowResults(false);
  };


  const handleCalculate = () => {
    if (people.length < 2) {
      alert("Adicione pelo menos duas pessoas para calcular a divisão.");
      return;
    }
    const calculatedSettlements = calculateSettlements(people);
    setSettlements(calculatedSettlements);
    setShowResults(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Organizador de Dívidas 💸</h1>

      <AddPersonForm onAddPerson={addPerson} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            onAddItem={addItemToPerson}
            onDeleteItem={deleteItem}
            onDeletePerson={deletePerson}
          />
        ))}
      </div>

      {people.length > 0 && (
        <div className="text-center my-8">
          <button
            onClick={handleCalculate}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg"
          >
            Calcular Divisão Igualitária
          </button>
        </div>
      )}

      {showResults && <ResultsDisplay settlements={settlements} people={people} />}
    </div>
  );
}