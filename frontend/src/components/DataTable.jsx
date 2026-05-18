import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const DataTable = ({ columns, data, loading = false, actions = [] }) => {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (column) => {
    setSortConfig({
      key: column,
      direction: sortConfig?.key === column && sortConfig?.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortedData = React.useMemo(() => {
    let sorted = [...data];
    if (sortConfig) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [data, sortConfig]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-400">No data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`px-4 py-3 text-left text-sm font-semibold text-gray-300 ${
                  col.sortable ? 'cursor-pointer hover:text-white' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortConfig?.key === col.key && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
            ))}
            {actions.length > 0 && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-300">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => action.onClick(row)}
                        className={`px-2 py-1 rounded text-xs ${
                          action.variant === 'danger'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-military-accent text-white hover:bg-military-lighter'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
