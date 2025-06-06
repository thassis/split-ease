import { clientApi } from "@/lib/api"; // Supondo que clientApi use 'fetch' internamente

// Mock global.fetch antes de todos os testes
let mockFetch: any;

beforeEach(() => {
  // Cria um novo mock para fetch antes de cada teste
  mockFetch = jest.fn();
  global.fetch = mockFetch;
});

afterEach(() => {
  // Restaura o fetch original ou limpa os mocks se necessário em outros lugares
  jest.restoreAllMocks();
});

describe('clientApi.createNewSplit', () => {
  it('deve retornar id e shareId corretamente', async () => {
    // Configura o mock para retornar uma resposta de sucesso
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: '123', shareId: 'abc' } }),
    });

    const result = await clientApi.createNewSplit();

    // Verifica se fetch foi chamado com os argumentos corretos
    expect(mockFetch).toHaveBeenCalledWith('/api/split', expect.objectContaining({ method: 'POST' }));
    // Verifica o resultado da função
    expect(result).toEqual({ id: '123', shareId: 'abc' });
  });

  it('deve lançar erro se a resposta falhar', async () => {
    // Configura o mock para retornar uma resposta de erro
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // Verifica se a promessa é rejeitada com o erro esperado
    await expect(clientApi.createNewSplit()).rejects.toThrow('Failed to create new split');
  });
});

describe('clientApi.getSplitByShareId', () => {
  const shareId = 'test123';

  it('deve retornar null se status for 404', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await clientApi.getSplitByShareId(shareId);

    expect(result).toBeNull();
  });

  it('deve lançar erro para outros erros de rede', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(clientApi.getSplitByShareId(shareId)).rejects.toThrow('Failed to fetch split');
  });
});

describe('clientApi.updateSplit', () => {
  const shareId = 'split1';
  const data = { title: 'Novo Título' };

  it('deve retornar true no sucesso', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      // Adicione json: async () => ({}) se sua clientApi.updateSplit tentar ler o corpo da resposta
    });

    const result = await clientApi.updateSplit(shareId, data as any);

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining(`/split/${shareId}`), expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify(data),
    }));
    expect(result).toBe(true);
  });

  it('deve retornar false se status for 404', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await clientApi.updateSplit(shareId, data as any);

    expect(result).toBe(false);
  });

  it('deve lançar erro se falhar com outro status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(clientApi.updateSplit(shareId, data as any)).rejects.toThrow('Failed to update split');
  });
});