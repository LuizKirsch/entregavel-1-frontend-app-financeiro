import type { Transaction, TransactionBody, TransactionStatus } from "./api";

let nextId = 10;

const store: Transaction[] = [
  { id: 1, user: "alice", description: "Salário Mensal", amount: 4500.0, type: "entrada", status: "recebido", month: "2026-03" },
  { id: 2, user: "alice", description: "Compra no Mercado", amount: 650.5, type: "saida", status: "pago", month: "2026-03" },
  { id: 3, user: "alice", description: "Conta de Luz", amount: 180.0, type: "saida", status: "pendente", month: "2026-03" },
  { id: 4, user: "alice", description: "Freelance Design", amount: 1200.0, type: "entrada", status: "recebido", month: "2026-03" },
  { id: 5, user: "alice", description: "Spotify Premium", amount: 21.9, type: "saida", status: "pago", month: "2026-03" },
  { id: 6, user: "alice", description: "Aluguel", amount: 1500.0, type: "saida", status: "pendente", month: "2026-04" },
  { id: 7, user: "alice", description: "Salário Mensal", amount: 4500.0, type: "entrada", status: "pendente", month: "2026-04" },
];

function delay<T>(value: T): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), 300));
}

export const mockApi = {
  listTransactions: (user: string, month?: string) => {
    const result = store.filter(
      (t) => t.user === user && (!month || t.month === month)
    );
    return delay([...result]);
  },

  getTransaction: (user: string, id: number) => {
    const t = store.find((t) => t.id === id && t.user === user) ?? null;
    return delay(t);
  },

  createTransaction: (user: string, body: TransactionBody) => {
    const t: Transaction = { id: nextId++, user, ...body };
    store.push(t);
    return delay({ ...t });
  },

  updateTransaction: (user: string, id: number, body: TransactionBody) => {
    const idx = store.findIndex((t) => t.id === id && t.user === user);
    if (idx === -1) return Promise.reject({ message: "Transação não encontrada." });
    store[idx] = { id, user, ...body };
    return delay({ ...store[idx] });
  },

  updateStatus: (user: string, id: number, status: TransactionStatus) => {
    const t = store.find((t) => t.id === id && t.user === user);
    if (!t) return Promise.reject({ message: "Transação não encontrada." });
    t.status = status;
    return delay({ ...t });
  },

  deleteTransaction: (user: string, id: number) => {
    const idx = store.findIndex((t) => t.id === id && t.user === user);
    if (idx === -1) return Promise.reject({ message: "Transação não encontrada." });
    const [deleted] = store.splice(idx, 1);
    return delay({ ...deleted });
  },
};
