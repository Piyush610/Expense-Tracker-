import { Download } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ExportButton() {
  const handleExport = async () => {
    try {
      const res = await api.get('/api/transactions/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <button onClick={handleExport} className="btn-ghost flex items-center gap-2 text-sm">
      <Download size={16} />
      Export CSV
    </button>
  );
}
