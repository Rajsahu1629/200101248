import React, { useState } from 'react';
import axios from 'axios';

const NumberManagementService = () => {
  const [inputUrls, setInputUrls] = useState('');
  const [result, setResult] = useState(null);

  const handleFetchData = () => {
    const urls = inputUrls.split(',').map(url => url.trim());
    const validUrls = urls.filter(url => isValidUrl(url));
    const fetchDataPromises = validUrls.map(url => axios.get(url).then(response => response.data));

    Promise.all(fetchDataPromises)
      .then(results => {
        const mergedNumbers = results.flatMap(data => data.numbers);
        mergedNumbers.sort((a, b) => a - b);
        setResult(mergedNumbers);
      })
      .catch(error => {
        setResult([]);
        console.error('Error fetching data:', error);
      });
  };

  const isValidUrl = url => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div>
      <center> <h1>Fetching Data and sorting</h1>
      <p>Enter URLs links (comma-separated):</p>
      <input type="text" value={inputUrls} onChange={e => setInputUrls(e.target.value)} />
      <button onClick={handleFetchData}>Fetch Data</button>

      {result && result.length > 0 && (
        <div>
          <h2>Results:</h2>
          {JSON.stringify({ numbers: result }, null, 2)}
        </div>
      )}

      {result && result.length === 0 && (
        <div>
          <h2>Error:</h2>
          <p>There was an error fetching data from the URLs.</p>
        </div>
      )}
      </center>
    </div>
  );
};

export default NumberManagementService;