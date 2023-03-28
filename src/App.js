import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

function App() {
  const [filterText, setFilterText] = useState('');
  const [h2List, setH2List] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  let elements;

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const scrapeWebsite = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array'
        )}`
      );
      const $ = cheerio.load(response.data.contents);
      elements = $('p');
      const filteredElements = elements.filter(function () {
        return (
          $(this).text().toLowerCase().indexOf(filterText.toLowerCase()) !== -1
        );
      });
      const filteredH2List = filteredElements
        .toArray()
        .map((element) => element.children[0].data);
      setH2List(filteredH2List);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage('Failed to scrape website. Please try again later.');
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrapeWebsite();
  }, []);

  useEffect(() => {
    scrapeWebsite();
  }, [filterText]);

  return (
    <div>
      <h1>Welcome to my React App!</h1>
      <label>
        Filter:{' '}
        <input type="text" value={filterText} onChange={handleFilterChange} />
      </label>
      <br />
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <>
          <p>The Scrapping Data:</p>
          <ul>
            {h2List.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
