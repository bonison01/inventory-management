"use client";

import { useState, useEffect } from 'react';

interface Stock {
  productName: string;
  qty: number;
}

export default function SalesPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [sellQty, setSellQty] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch product inventory from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/proxy', { method: 'GET' });
        const data = await response.json();
        if (Array.isArray(data)) {
          setStocks(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchData();
  }, []);

  // Handle selling a product
  const handleSell = async () => {
    setLoading(true);
    setMessage('');

    // Ensure selected product and valid quantity
    const product = stocks.find(stock => stock.productName === selectedProduct);
    if (!product || product.qty < Number(sellQty)) {
      setMessage('Insufficient stock or product not found');
      setLoading(false);
      return;
    }

    // Prepare sale data to send to the API
    const saleData = {
      action: 'sell',
      productName: selectedProduct,
      qty: Number(sellQty),
      customerName,
      sellerName,
    };

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Sale recorded successfully!');
        setSelectedProduct('');
        setSellQty('');
        setCustomerName('');
        setSellerName('');
      } else {
        setMessage(result.error || 'Sale failed');
      }
    } catch (error) {
      console.error('Error selling product:', error);
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Sales</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Product Name:
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">Select a product</option>
            {stocks.map(stock => (
              <option key={stock.productName} value={stock.productName}>
                {stock.productName} (Available: {stock.qty})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Quantity:
          <input
            type="number"
            value={sellQty}
            onChange={(e) => setSellQty(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Customer Name:
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Seller Name:
          <input
            type="text"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
            required
          />
        </label>
      </div>

      <button
        onClick={handleSell}
        style={{
          padding: '10px 20px',
          backgroundColor: '#005C06',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Submit Sale'}
      </button>

      {message && <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
    </section>
  );
}
