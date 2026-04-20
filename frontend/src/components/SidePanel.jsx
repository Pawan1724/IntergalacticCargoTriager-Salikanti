import React from 'react';

const SidePanel = ({ isOpen, toggle }) => {
  return (
    <>
      <button className="panel-toggle" onClick={toggle}>
        {isOpen ? '✕ Close' : 'ℹ Instructions'}
      </button>
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <h2>Command Console</h2>
        
        <section>
          <h3>How to Operate</h3>
          <p>Deploy the intergalactic systems in this order:</p>
          <ol>
            <li>
              <strong>Backend:</strong>
              <code>python app.py</code>
              <small>(Runs on port 5000)</small>
            </li>
            <li>
              <strong>Frontend:</strong>
              <code>cd frontend && npm run dev</code>
              <small>(Runs on port 5173)</small>
            </li>
          </ol>
        </section>

        <section>
          <h3>API Information</h3>
          <p>Main Endpoint:</p>
          <code>GET /api/cargo</code>
          <h3>System Override</h3>
          <p>Sending the header <code>X-System-Override: true</code> will trigger a 418 protocol (I'm a teapot).</p>
        </section>

        <section>
          <h3>Cargo Requirements</h3>
          <ul>
            <li><strong>Sorting:</strong> Heaviest cargo is prioritized by the engine.</li>
            <li><strong>Earth Protocol:</strong> ALL Earth-bound cargo is pinned to the absolute bottom for final offloading.</li>
            <li><strong>Sector-7:</strong> Titan cargo receives a 1.45x weight multiplier.</li>
            <li><strong>Rounding:</strong> All adjusted weights are rounded to the nearest whole integer.</li>
            <li><strong>Prime Filter:</strong> Cargo with prime-number rounded weights is prohibited and filtered out.</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default SidePanel;
