import { useState, useEffect } from 'react';
import axios from 'axios';
import CargoTable from './components/CargoTable';
import './App.css';

function App() {
  const [cargoData, setCargoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncText, setSyncText] = useState('Sync Data');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cargo');
      setCargoData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cargo:', err);
      setError('Failed to fetch cargo mission data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncText('Aligning quantum drives...');

    // EXACTly 2.5 seconds delay as per UX Rule
    setTimeout(async () => {
      await fetchData();
      setIsSyncing(false);
      setSyncText('Sync Data');
    }, 2500);
  };

  // Sorting Logic: Non-Earth by weight DESC, Earth items always last
  const sortedCargo = [...cargoData].sort((a, b) => {
    if (a.destination === 'Earth' && b.destination !== 'Earth') return 1;
    if (a.destination !== 'Earth' && b.destination === 'Earth') return -1;
    if (a.destination === 'Earth' && b.destination === 'Earth') return 0; // Both Earth, order doesn't matter relative to each other
    
    // Both non-Earth, sort by weight DESC
    return b.weight - a.weight;
  });

  return (
    <div className="dashboard">
      <h1>Intergalactic Cargo Triager - Salikanti</h1>
      
      <button 
        className="sync-button" 
        onClick={handleSync} 
        disabled={isSyncing}
      >
        {syncText}
      </button>

      {loading ? (
        <div className="loading">Loading manifest data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <CargoTable data={sortedCargo} />
      )}
    </div>
  );
}

export default App;
