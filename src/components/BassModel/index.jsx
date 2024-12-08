// src/components/BassModel/index.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Historical data
const historicalData = [
  { year: 1990, sales: 401700, cumulative: 401700 },
  { year: 1991, sales: 701434, cumulative: 1103134 },
  { year: 1992, sales: 1219161, cumulative: 2322295 },
  { year: 1993, sales: 2191594, cumulative: 4513889 },
  { year: 1994, sales: 3757772, cumulative: 8271661 },
  { year: 1995, sales: 5924702, cumulative: 14196363 },
  { year: 1996, sales: 9413320, cumulative: 23609683 },
  { year: 1997, sales: 13551200, cumulative: 37160883 },
  { year: 1998, sales: 18158887, cumulative: 55319770 },
  { year: 1999, sales: 19464483, cumulative: 74784253 },
  { year: 2000, sales: 15310223, cumulative: 90094476 }
];

const BassModel = () => {
  // Model parameters
  const [parameters, setParameters] = useState({
    p: 0.0039,
    q: 0.753,
    m: 103000000,
    periods: 24
  });

  const [modelData, setModelData] = useState([]);
  const [showHistorical, setShowHistorical] = useState(true);

  // Calculate Bass diffusion values
  const calculateBassModel = () => {
    const { p, q, m } = parameters;
    const data = historicalData.map(point => {
      const t = point.year - 1990;
      const expTerm = Math.exp(-(p + q) * t);
      const adoptions = m * (1 - expTerm) / (1 + (q/p) * expTerm);
      const prevAdoptions = t === 0 ? 0 : 
        m * (1 - Math.exp(-(p + q) * (t-1))) / (1 + (q/p) * Math.exp(-(p + q) * (t-1)));
      
      return {
        ...point,
        predictedSales: adoptions - prevAdoptions,
        predictedCumulative: adoptions
      };
    });

    setModelData(data);
  };

  // Update calculations when parameters change
  useEffect(() => {
    calculateBassModel();
  }, [parameters]);

  // Format large numbers
  const formatNumber = (value) => new Intl.NumberFormat().format(Math.round(value));

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Bass Diffusion Model Analysis</h2>
        
        {/* Parameter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-8">
            {/* Innovation Coefficient Slider */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Innovation Coefficient (p)
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <input
                    type="range"
                    min="0"
                    max="0.1"
                    step="0.001"
                    value={parameters.p}
                    onChange={(e) => setParameters(prev => ({ ...prev, p: parseFloat(e.target.value) }))}
                    className="slider-input"
                  />
                </div>
                <span className="text-lg font-medium w-20 text-right">
                  {parameters.p.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Imitation Coefficient Slider */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Imitation Coefficient (q)
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={parameters.q}
                    onChange={(e) => setParameters(prev => ({ ...prev, q: parseFloat(e.target.value) }))}
                    className="slider-input"
                  />
                </div>
                <span className="text-lg font-medium w-20 text-right">
                  {parameters.q.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Market Potential (m)
              </label>
              <input
                type="number"
                value={parameters.m}
                onChange={(e) => setParameters(prev => ({ ...prev, m: parseFloat(e.target.value) }))}
                className="w-full p-2 text-lg border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Time Periods
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={parameters.periods}
                  onChange={(e) => setParameters(prev => ({ ...prev, periods: parseInt(e.target.value) }))}
                  className="w-full p-2 text-lg border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="50"
                />
                <span className="text-lg font-medium">years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700">Peak Year</h4>
            <p className="text-2xl font-bold">1999</p>
            <p className="text-sm text-gray-600">{formatNumber(19464483)} units</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700">Total Adoption by 2000</h4>
            <p className="text-2xl font-bold">{formatNumber(90094476)}</p>
            <p className="text-sm text-gray-600">87.5% of market potential</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700">Growth Factors</h4>
            <p className="text-2xl font-bold">75.3%</p>
            <p className="text-sm text-gray-600">word-of-mouth effect</p>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-8">
          {/* Annual Sales Chart */}
          <div className="h-[400px]">
            <h3 className="text-lg font-medium mb-4">Annual Sales Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={modelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  name="Actual Sales"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predictedSales" 
                  stroke="#82ca9d" 
                  name="Predicted Sales"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cumulative Sales Chart */}
          <div className="h-[400px]">
            <h3 className="text-lg font-medium mb-4">Cumulative Sales Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={modelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#8884d8" 
                  name="Actual Cumulative"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predictedCumulative" 
                  stroke="#82ca9d" 
                  name="Predicted Cumulative"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BassModel;