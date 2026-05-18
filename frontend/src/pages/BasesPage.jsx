import React, { useState, useEffect } from 'react';
import { baseService } from '../services/apiService.js';
import { DataTable } from '../components/DataTable.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import { Toast } from '../components/FormComponents.jsx';

export const BasesPage = () => {
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    try {
      const res = await baseService.getAll();
      setBases(res.data.data);
    } catch (err) {
      Toast.error('Failed to load bases');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Bases</h1>
        </div>

        <div className="card">
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'location', label: 'Location' },
            ]}
            data={bases}
            loading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default BasesPage;
