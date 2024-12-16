"use client"

import Header from "../header";
import React, { useState, useEffect } from 'react';
import { useFetch } from '../useFetch';

type Country = {
  name: string;
  flag: string;
};

export default function Country() {
  const [countries, setCountries] = useState<Country[]>([]);
  const API_URL = "https://api-7bjw3wubma-uc.a.run.app";
  const { data, error, loading, fetchData } = useFetch<Country[]>(`${API_URL}/get_country_list`);

   // Fetch countries on initial mount
   useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update countries list when data changes
  useEffect(() => {
    if (data) {
      const countryData = data.map((country: any) => ({
        name: country.name.common,
        flag: country.flags.svg,
      }));
      setCountries(countryData);
    }
  }, [data]);

  // // POST request example
  // const addCountry = async () => {
  //   await fetchData('https://example.com/api/countries', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ name: 'New Country', flag: 'https://example.com/flag.svg' }),
  //   });

  //   alert('Country added!');
  //   fetchData(); // Refresh country list
  // };

  // // DELETE request example
  // const deleteCountry = async (countryName: string) => {
  //   await fetchData(`https://example.com/api/countries/${countryName}`, {
  //     method: 'DELETE',
  //   });

  //   alert(`Country "${countryName}" deleted!`);
  //   fetchData(); // Refresh country list
  // };

  
  return (
    <>
      <Header />
      <br></br>
      
      <div className="m-4">
        <h1>Country List</h1>
        {loading && <h1>Loading...</h1>}
        {error && <h2>Error: {error}</h2>}

        {countries && 
        <table border={1} className="country-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {countries?.map((country, index) => (
              <tr key={index}>
                <td>{country['name']}</td>
                <td>
                  <img src={country['flag']} alt={`Flag of ${country['name']}`} width="50" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </>
  );
}
