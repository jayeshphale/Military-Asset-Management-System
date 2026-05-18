import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const SimpleBarChart = ({ data, xKey, yKey, title }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} fill="#3d6f42" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SimpleLineChart = ({ data, xKey, lines, title }) => {
  const COLORS = ['#3d6f42', '#2a4d2e', '#1e3a1f'];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line, idx) => (
            <Line
              key={line}
              type="monotone"
              dataKey={line}
              stroke={COLORS[idx % COLORS.length]}
              dot={{ fill: COLORS[idx % COLORS.length] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SimplePieChart = ({ data, dataKey, nameKey, title }) => {
  const COLORS = ['#3d6f42', '#2a4d2e', '#1e3a1f', '#0d6938', '#052e16'];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#3d6f42"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default { SimpleBarChart, SimpleLineChart, SimplePieChart };
