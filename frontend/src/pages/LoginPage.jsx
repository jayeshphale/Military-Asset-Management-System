import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { authService } from '../services/apiService.js';
import { FormInput, FormButton, Toast } from '../components/FormComponents.jsx';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      login(response.data.user, response.data.token);
      Toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-military-dark flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-3xl font-bold text-center text-military-accent mb-8">
            Military Asset Management System
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormInput
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormButton loading={loading} className="w-full">
              Login
            </FormButton>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-4">Demo Credentials:</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400">Admin:</p>
                <p className="text-white">admin@military.com</p>
                <p className="text-gray-500">Admin@123</p>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400">Commander:</p>
                <p className="text-white">commander@military.com</p>
                <p className="text-gray-500">Commander@123</p>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400">Logistics:</p>
                <p className="text-white">logistics@military.com</p>
                <p className="text-gray-500">Logistics@123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
