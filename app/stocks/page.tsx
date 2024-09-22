"use client";

import { useEffect, useState } from 'react';
import styles from './stocks.module.css'; // Import CSS for styling

interface Stock {
  productName: string;
  qty: number;
  sellingPrice: number;
  trainerPrice: number;
  storePrice: number;
  company: string;
  rowIndex: number;
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  // Fetch stock data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/proxy', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setStocks(data);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load stocks');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (rowIndex: number) => {
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete', rowIndex }),
      });

      const result = await response.json();
      if (result.success) {
        setStocks(stocks.filter((stock) => stock.rowIndex !== rowIndex));
      } else {
        console.error('Error deleting stock:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
  };

  const handleSaveEdit = async () => {
    if (!editingStock) return;

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'edit',
          rowIndex: editingStock.rowIndex,
          productName: editingStock.productName,
          qty: editingStock.qty,
          sellingPrice: editingStock.sellingPrice,
          trainerPrice: editingStock.trainerPrice,
          storePrice: editingStock.storePrice,
          company: editingStock.company,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Update the stock list with the edited product
        setStocks((prevStocks) =>
          prevStocks.map((stock) =>
            stock.rowIndex === editingStock.rowIndex ? editingStock : stock
          )
        );
        setEditingStock(null); // Reset editing state
      } else {
        console.error('Error editing stock:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Stocks List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Selling Price</th>
              <th>Trainer Price</th>
              <th>Store Price</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.rowIndex}>
                <td>
                  {editingStock && editingStock.rowIndex === stock.rowIndex ? (
                    <input
                      value={editingStock.productName}
                      onChange={(e) =>
                        setEditingStock({ ...editingStock, productName: e.target.value })
                      }
                    />
                  ) : (
                    stock.productName
                  )}
                </td>
                <td>
                  {editingStock && editingStock.rowIndex === stock.rowIndex ? (
                    <input
                      value={editingStock.qty}
                      type="number"
                      onChange={(e) =>
                        setEditingStock({ ...editingStock, qty: Number(e.target.value) })
                      }
                    />
                  ) : (
                    stock.qty
                  )}
                </td>
                <td>{stock.sellingPrice}</td>
                <td>{stock.trainerPrice}</td>
                <td>{stock.storePrice}</td>
                <td>{stock.company}</td>
                <td>
                  {editingStock && editingStock.rowIndex === stock.rowIndex ? (
                    <button onClick={handleSaveEdit} className={styles.saveButton}>
                      Save
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(stock)} className={styles.editButton}>
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(stock.rowIndex)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
