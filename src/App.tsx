import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Thermometer } from 'lucide-react';
import TemperatureChart from './components/TemperatureChart';
import type { TemperatureData } from './types/temperature';

function App() {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/temperature');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch temperature data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header */}
      <header className="bg-[#1d1d1f] text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <Thermometer className="h-8 w-8 text-[#2997ff]" />
            <h1 className="text-2xl font-medium">Temperature Monitor</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2997ff]"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[600px] text-red-500">
              {error}
            </div>
          ) : (
            <TemperatureChart data={data} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-6">
        <div className="container mx-auto px-6 text-center text-[#86868b]">
          <p>Temperature Monitoring System © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;