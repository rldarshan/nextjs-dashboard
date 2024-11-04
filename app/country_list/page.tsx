"use client"

import React, { useState, useEffect } from 'react';

export default function Country() {
 const [countries, setCountries] = useState([]);
 
  useEffect(() => {
    async function fetchCountry() {
      let res = await fetch('https://restcountries.com/v3.1/all')
      let data = await res.json()
          const countryData = data.map((country: any) => ({
            name: country.name.common,
            flag: country.flags.svg,
          }));
          setCountries(countryData);
    }
    fetchCountry()
  }, [])

  return (
    <div className="App">
      <h1>Country List</h1>
      <table border="1" style={{ width: '100%', textAlign: 'left'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <tr key={index}>
              <td>{country['name']}</td>
              <td>
                <img src={country['flag']} alt={`Flag of ${country['name']}`} width="50" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
