import React from 'react';

export const Header = ({ onSync, isSyncing, syncText }) => (
  <header>
    <h1>INTERGALACTIC CARGO TRIAGER — SALIKANTI</h1>
    <button 
      className="header-sync-button" 
      onClick={onSync} 
      disabled={isSyncing}
    >
      {syncText}
    </button>
  </header>
);

export const Footer = () => (
  <footer>
    <p>Intergalactic Logistics Control System v4.2.0 | Mission: Pawan1724/IntergalacticCargoTriager-Salikanti</p>
    <p>&copy; 2026 Space Cargo Authority. All Rights Reserved.</p>
  </footer>
);
