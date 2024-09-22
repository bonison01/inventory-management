import Link from 'next/link';

export default function HomePage() {
  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to my project for inventory managemennt</h1>
      <p>This is the homepage content.</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <Link href="/sales">
          <button style={buttonStyle}>Sales</button>
        </Link>
        <Link href="/products">
          <button style={buttonStyle}>Products</button>
        </Link>
        <Link href="/customers">
          <button style={buttonStyle}>Customers</button>
        </Link>
      </div>
    </section>
  );
}

const buttonStyle = {
  padding: '1rem 2rem',
  fontSize: '1rem',
  cursor: 'pointer',
  backgroundColor: '#005C06',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  transition: 'background-color 0.3s ease',
};
