import { mockApi } from "./api.mock";

const BASE_URL = "https://controle-financeiro-nine-mu.vercel.app";

const USE_MOCK = false;
export const DEFAULT_USER = "lucas";

export type TransactionType = "entrada" | "saida";
export type TransactionStatus = "pendente" | "pago" | "recebido";

export type Transaction = {
  id: number;
  user: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  month: string;
};

export type TransactionBody = Omit<Transaction, "id" | "user">;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
}

const realApi = {
  listTransactions: (user: string, month?: string) => {
    const query = month ? `?month=${month}` : "";
    return request<Transaction[]>(`/${user}/transactions${query}`);
  },

  getTransaction: (user: string, id: number) =>
    request<Transaction | null>(`/${user}/transactions/${id}`),

  createTransaction: (user: string, body: TransactionBody) =>
    request<Transaction>(`/${user}/transactions`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateTransaction: (user: string, id: number, body: TransactionBody) =>
    request<Transaction>(`/${user}/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  updateStatus: (user: string, id: number, status: TransactionStatus) =>
    request<Transaction>(`/${user}/transactions/${id}/update-status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteTransaction: (user: string, id: number) =>
    request<Transaction>(`/${user}/transactions/${id}`, { method: "DELETE" }),
};
export const api = USE_MOCK ? mockApi : realApi;
