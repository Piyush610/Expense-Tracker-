import { useState, useCallback } from 'react';
import api from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/transactions', { params });
      setTransactions(data.transactions);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = async (payload) => {
    const { data } = await api.post('/api/transactions', payload);
    return data;
  };

  const updateTransaction = async (id, payload) => {
    const { data } = await api.put(`/api/transactions/${id}`, payload);
    return data;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/api/transactions/${id}`);
  };

  return {
    transactions,
    loading,
    total,
    pages,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
