import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';

// 0xc0ffee254729296a45a3885639AC7E10F9d54979

function App() {
  const [input, setInput] = useState<string>('');
  const [list, setList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null); 
  let [successMsg, setSuccess] = useState<string | null>(null);   
  let [addressInput, setAddress] = useState<string>('');
  const ADDRESSLEN = 42;

  function countDots(string: string): number {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
      if (string[i] === '.') {
        count++;
      }
    }
    return count;
  };

  function setAddressInput(): any {
    addressInput = '';
  }

  function onSuccess(): any {
    successMsg = 'Address successfully added!';
  }

  const handleAddress = () => {

    if (addressInput.trim() === '') {
      setError('Input cannot be empty.'); // <-- Set error
      return;
    }

    if (addressInput.length !== ADDRESSLEN) {
      setError('Input does not match required length. Try again.'); // <-- check len
      return;
    }

    onSuccess(); // <-- if we made it here we are successful
    setError(null);
    setAddress(addressInput);
    setAddressInput();
    
  };

  const handleAdd = () => {

    if (input.trim() === '') {
      setError('Input cannot be empty.'); // <-- Set error
      return;
    }

    if (!/^[0-9.]+$/.test(input)) {
      setError('Invalid input. Only accepting ints or decimals!'); // <-- Set error
      return;
    }

    if (countDots(input) > 1) {
      setError('Too many decimals!');
      return;
    }

    setError(null); // Reset the error if any
    setList([...list, input]);
    setInput('');

  };

  function getEthPrice(): number {
    let response = 0;
    new Promise(async (resolve, reject) => {
      try {
        response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest');
      } catch (error) {
          console.error(error);
        };
      });    

    return response;
  };

  const subtotal = list.reduce((acc, curr) => acc + parseFloat(curr), 0);
  const ethPrice = getEthPrice();

  return (
    
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="p-8 bg-white rounded-lg shadow-xl w-96">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-semibold">Payment Information: @{addressInput}</h1>
            <p className="text-gray-600">Enter transaction details below:</p>
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Address:</label>
            <input
              type="text"
              className="p-3 border rounded-lg shadow-sm w-full bg-gray-50"
              placeholder="Enter an address..."
              value={addressInput}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button 
              className="mt-2 w-full p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
              onClick={handleAddress}
            >
              Set Address
            </button>
          </div>
          {successMsg && <p className="text-red-600 mb-4 text-center">{successMsg}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Amount:</label>
            <input
              type="text"
              className="p-3 border rounded-lg shadow-sm w-full"
              placeholder="Enter a number..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              className="mt-2 w-full p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
  
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          
          <div className="mb-4">
            <ul className="list-decimal space-y-2 text-lg pl-4">
              {list.map((item, index) => (
                <li key={index} className="mb-1">{item}</li>
              ))}
            </ul>
          </div>
          <br></br>
          {list.length > 0 && <p className="mt-4 text-xl font-semibold text-center">Subtotal: ${subtotal.toFixed(2)}</p>}
          {ethPrice !== 0 && <p className="mt-4 text-xl font-semibold text-center">ETH Price: {ethPrice.toFixed(8)}</p>}
        </div>
      </div>
    );
}

//Ξ

export default App;
