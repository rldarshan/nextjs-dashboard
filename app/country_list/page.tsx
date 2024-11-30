"use client"

import Header from "../header";
import React, { useState, useEffect } from 'react';

export default function Country() {
 const [countries, setCountries] = useState([]);
const API_URL = "https://api-7bjw3wubma-uc.a.run.app";
 
  useEffect(() => {
    async function fetchCountry() {
      let res = await fetch(`${API_URL}/get_country_list`)
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
    <>
      <Header />
      <br></br>
      
      <div className="App">
        <h1>Country List</h1>
        <table border={1} style={{ width: '100%', textAlign: 'left'}}>
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
    </>
  );
}
