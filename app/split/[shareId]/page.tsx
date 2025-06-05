'use client';

import { useEffect, useState } from 'react';
import { Person, Item, Settlement } from '../../types';
import { calculateSettlements } from '../../lib/debtCalculator';
import AddPersonForm from '../../components/AddPersonForm';
import PersonCard from '../../components/PersonCard';
import ResultsDisplay from '../../components/ResultsDisplay';
import { useParams } from 'next/navigation';
import { clientApi } from '../../lib/api';

export default function SplitPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const params = useParams<{ shareId: string }>()
  const { shareId } = params;

  useEffect(() => {
    const loadSplit = async () => {
      try {
        const split = await clientApi.getSplitByShareId(shareId);
        if (split) {
          setPeople(split.people);
          setSettlements(split.settlements);
          if (split.settlements.length > 0) {
            setShowResults(true);
          }
        }
      } catch (error) {
        console.error('Error loading split:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSplit();
  }, [shareId]);

  const saveToDatabase = async (updatedPeople: Person[] = people, updatedSettlements: Settlement[] = settlements) => {
    try {
      await clientApi.updateSplit(shareId, {
        people: updatedPeople,
        settlements: updatedSettlements,
        items: updatedPeople.flatMap(person => person.items)
      });
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  const addPerson = (name: string) => {
    if (name.trim() === '') return;
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name,
      items: [],
    };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    saveToDatabase(updatedPeople, settlements);
  };

  const addItemToPerson = (personId: string, item: Omit<Item, 'id'>) => {
    const newItem: Item = { ...item, id: crypto.randomUUID() };
    const updatedPeople = people.map((person) =>
      person.id === personId
        ? { ...person, items: [...person.items, newItem] }
        : person
    );
    setPeople(updatedPeople);
    setShowResults(false);
    saveToDatabase(updatedPeople, settlements);
  };

  const deleteItem = (personId: string, itemId: string) => {
    const updatedPeople = people.map((person) =>
      person.id === personId
        ? { ...person, items: person.items.filter((item) => item.id !== itemId) }
        : person
    );
    setPeople(updatedPeople);
    setShowResults(false);
    saveToDatabase(updatedPeople, settlements);
  };

  const deletePerson = (personId: string) => {
    const updatedPeople = people.filter((person) => person.id !== personId);
    setPeople(updatedPeople);
    setShowResults(false);
    saveToDatabase(updatedPeople, settlements);
  };

  const handleCalculate = () => {
    if (people.length < 2) {
      alert("Adicione pelo menos duas pessoas para calcular a divisão.");
      return;
    }
    const calculatedSettlements = calculateSettlements(people);
    setSettlements(calculatedSettlements);
    setShowResults(true);
    saveToDatabase(people, calculatedSettlements);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizador de Dívidas 💸</h1>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded">
          ID: {shareId}
        </div>
      </div>

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
