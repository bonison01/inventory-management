"use client";

import { useState } from 'react';

export default function ProductsPage() {
  const [productName, setProductName] = useState('');
  const [qty, setQty] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [trainerPrice, setTrainerPrice] = useState('');
  const [storePrice, setStorePrice] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const productData = {
      action: 'add', // Make sure the action is included
      productName,
      qty,
      sellingPrice,
      trainerPrice,
      storePrice,
      company,
    };

    console.log('Submitting product data:', productData); // Log data being sent

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      console.log("Response from server:", result);

      if (response.ok) {
        setMessage('Product added successfully!');
        setProductName('');  // Clear form fields
        setQty('');
        setSellingPrice('');
        setTrainerPrice('');
        setStorePrice('');
        setCompany('');
      } else {
        console.error('Error response from server:', result);
        setMessage(`Failed to add product: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while adding the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: 'auto' }}>
        <label>
          Name of the Product:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </label>
        <label>
          Qty:
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            required
          />
        </label>
        <label>
          Selling Price:
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Trainer Price:
          <input
            type="number"
            value={trainerPrice}
            onChange={(e) => setTrainerPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Store Price:
          <input
            type="number"
            value={storePrice}
            onChange={(e) => setStorePrice(e.target.value)}
            required
          />
        </label>
        <label>
          Company:
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          style={{ padding: '1rem', backgroundColor: '#005C06', color: 'white', border: 'none', borderRadius: '5px' }}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}
