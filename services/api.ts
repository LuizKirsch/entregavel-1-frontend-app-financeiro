// Altere para o IP da sua máquina se estiver testando em dispositivo físico
// Exemplo: 'http://192.168.0.10:3333'
const BASE_URL = 'http://localhost:3333'; 

export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  type: 'entrada' | 'saida';
  status: 'pendente' | 'pago' | 'recebido';
  month: string; // Formato YYYY-MM
  date?: string; 
  category?: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'Erro desconhecido no servidor' };
    }
    throw { status: response.status, data: errorData };
  }
  return response.json();
};

export const api = {
  getTransactions: async (user: string, month?: string): Promise<Transaction[]> => {
    try {
      const url = new URL(`${BASE_URL}/${user}/transactions`);
      if (month) url.searchParams.append('month', month);
      
      const response = await fetch(url.toString());
      return handleResponse(response);
    } catch (error: any) {
      if (error.status) throw error;
      throw { status: 500, data: { message: 'Erro de conexão com o servidor. Verifique se o Back-end está rodando.' } };
    }
  },

  getTransactionById: async (user: string, id: string): Promise<Transaction | null> => {
    try {
      const response = await fetch(`${BASE_URL}/${user}/transactions/${id}`);
      if (response.status === 404) return null;
      return handleResponse(response);
    } catch (error: any) {
      if (error.status) throw error;
      throw { status: 500, data: { message: 'Erro de conexão.' } };
    }
  },

  createTransaction: async (user: string, data: Omit<Transaction, 'id'>): Promise<Transaction> => {
    try {
      const response = await fetch(`${BASE_URL}/${user}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error.status) throw error;
      throw { status: 500, data: { message: 'Erro de conexão.' } };
    }
  },

  updateTransaction: async (user: string, id: string, data: Omit<Transaction, 'id'>): Promise<Transaction> => {
    try {
      const response = await fetch(`${BASE_URL}/${user}/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error.status) throw error;
      throw { status: 500, data: { message: 'Erro de conexão.' } };
    }
  },

  updateTransactionStatus: async (user: string, id: string, status: Transaction['status']): Promise<Transaction> => {
    try {
      const response = await fetch(`${BASE_URL}/${user}/transactions/${id}/update-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    } catch (error: any) {
      if (error.status) throw error;
      throw { status: 500, data: { message: 'Erro de conexão.' } };
    }
  },

  deleteTransaction: async (user: string, id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/${user}/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) return handleResponse(response);
    } catch (error: any) {
      if (error.status) throw error;
      throw { status: 500, data: { message: 'Erro de conexão.' } };
    }
  },
};
