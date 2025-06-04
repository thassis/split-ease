'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientApi } from './lib/api';

export default function HomePage() {
  const router = useRouter();
  const [shareId, setShareId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateNew = async () => {
    try {
      setIsCreating(true);
      const { shareId } = await clientApi.createNewSplit();
      router.push(`/split/${shareId}`);
    } catch (error) {
      console.error('Error creating new split:', error);
      setError('Erro ao criar novo organizador. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareId.trim()) {
      setError('Por favor, insira um ID válido');
      return;
    }
    router.push(`/split/${shareId.trim()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Split Ease</h1>
          <p className="text-gray-600">Organize e divida contas de forma simples e justa</p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleCreateNew}
              disabled={isCreating}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isCreating ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isCreating ? 'Criando...' : 'Criar Novo Organizador'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleJoin}>
            <div>
              <label htmlFor="shareId" className="block text-sm font-medium text-gray-700 mb-1">
                Juntar-se a um organizador existente
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="shareId"
                  value={shareId}
                  onChange={(e) => setShareId(e.target.value)}
                  placeholder="Digite o ID do organizador"
                  className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border p-2"
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Compartilhe o ID com seus amigos para dividir contas juntos!</p>
        </div>
      </div>
    </div>
  );
}