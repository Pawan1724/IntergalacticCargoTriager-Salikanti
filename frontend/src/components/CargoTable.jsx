import React from 'react';

const CargoTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Destination</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.destination}</td>
            <td>{item.weight}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CargoTable;
