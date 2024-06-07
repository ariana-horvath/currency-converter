import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./../css/CurrencyConverter.css"; 

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState(null);
  const apiKey = process.env.REACT_APP_CURRENCY_API_KEY; 

  useEffect(() => {
    // Fetch list of currencies
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        setCurrencies(Object.keys(response.data.conversion_rates));
        setExchangeRate(response.data.conversion_rates[toCurrency]);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCurrencies();
  }, [toCurrency]);

  useEffect(() => {
    // Fetch exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
        setExchangeRate(response.data.conversion_rates[toCurrency]);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleFromCurrencyChange = (e) => setFromCurrency(e.target.value);
  const handleToCurrencyChange = (e) => setToCurrency(e.target.value);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Currency Converter</h1>
      <div className='inputs'>
        <input type="number" value={amount} onChange={handleAmountChange} />
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
        to 
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      {exchangeRate && (
        <h2>{amount} {fromCurrency} = {(amount * exchangeRate).toFixed(2)} {toCurrency}</h2>
      )}
    </div>
  );
};

export default CurrencyConverter;
