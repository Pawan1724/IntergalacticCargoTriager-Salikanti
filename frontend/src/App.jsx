import { useState, useEffect } from 'react';
import axios from 'axios';
import CargoTable from './components/CargoTable';
import SidePanel from './components/SidePanel';
import { Header, Footer } from './components/Layout';
import './App.css';

function App() {
  const [cargoData, setCargoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncText, setSyncText] = useState('SYNC DATA');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cargo');
      setCargoData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cargo:', err);
      setError('CARGO COMMS FAILURE: UNABLE TO REACH STATION.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncText('ALIGNING...');
    
    // EXACTly 2.5 seconds delay
    setTimeout(async () => {
      await fetchData();
      setIsSyncing(false);
      setSyncText('SYNC DATA');
    }, 2500);
  };

  // Business Rule 4: Sort data
  const sortedCargo = [...cargoData].sort((a, b) => {
    if (a.destination === 'Earth' && b.destination !== 'Earth') return 1;
    if (a.destination !== 'Earth' && b.destination === 'Earth') return -1;
    if (a.destination === 'Earth' && b.destination === 'Earth') return 0;
    
    return b.weight - a.weight;
  });

  return (
    <>
      <Header onSync={handleSync} isSyncing={isSyncing} syncText={syncText} />
      <SidePanel isOpen={isPanelOpen} toggle={() => setIsPanelOpen(!isPanelOpen)} />
      
      <main className={`dashboard-container ${isPanelOpen ? 'shifted' : ''}`}>
        <div className="dashboard-card">
          {loading ? (
            <div className="loading">SIGNAL WEAK... SCANNING MANIFESTS...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <CargoTable data={sortedCargo} />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;
