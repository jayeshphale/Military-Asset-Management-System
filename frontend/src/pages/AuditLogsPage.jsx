import React, { useState, useEffect } from 'react';
import { auditLogService } from '../services/apiService.js';
import { DataTable } from '../components/DataTable.jsx';
import { FormInput, Toast } from '../components/FormComponents.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import { useAuth } from '../hooks/useAuth.js';

export const AuditLogsPage = () => {
  const { user: currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (currentUser?.role === 'Admin') {
      fetchLogs();
    }
  }, [currentUser, page]);

  const fetchLogs = async () => {
    try {
      const res = await auditLogService.getAll(page, 50);
      setLogs(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      Toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      Toast.error('Please select both dates');
      return;
    }

    try {
      const res = await auditLogService.getByDateRange(startDate, endDate);
      setLogs(res.data.data);
      setPagination(null);
    } catch (error) {
      Toast.error('Failed to fetch logs');
    }
  };

  if (currentUser?.role !== 'Admin') {
    return <MainLayout><div className="text-red-500">Access denied</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Audit Logs</h1>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Filter by Date Range</h3>
          <form onSubmit={handleDateFilter} className="flex gap-4">
            <FormInput
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <FormInput
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button type="submit" className="btn-primary mt-7">
              Filter
            </button>
            <button
              type="button"
              onClick={() => {
                setStartDate('');
                setEndDate('');
                fetchLogs();
              }}
              className="btn-secondary mt-7"
            >
              Reset
            </button>
          </form>
        </div>

        <div className="card">
          <DataTable
            columns={[
              { key: 'user_name', label: 'User' },
              { key: 'action', label: 'Action' },
              { key: 'module_name', label: 'Module' },
              { key: 'endpoint', label: 'Endpoint' },
              { key: 'ip_address', label: 'IP Address' },
              { key: 'timestamp', label: 'Timestamp', render: (row) => new Date(row.timestamp).toLocaleString() },
            ]}
            data={logs}
            loading={loading}
          />
        </div>

        {pagination && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <span className="text-white">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AuditLogsPage;
