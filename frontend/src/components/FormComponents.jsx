import React from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const FormInput = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>}
      <input
        {...props}
        className={`input-field ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const FormSelect = ({ label, options, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>}
      <select
        {...props}
        className={`input-field ${error ? 'border-red-500' : ''}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const FormTextarea = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>}
      <textarea
        {...props}
        className={`input-field ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const FormButton = ({ children, loading = false, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading}
      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export const Toast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
};

export default { FormInput, FormSelect, FormTextarea, FormButton, Toast };
