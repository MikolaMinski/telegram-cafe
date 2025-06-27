import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './Menu';
import Cart from './Cart';
import Order from './Order';

declare global {
  interface Window {
    Telegram?: any;
  }
}

function App() {
  const [page, setPage] = useState<'menu' | 'cart' | 'order'>('menu');

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className="App" style={{ background: '#f3f4f6', minHeight: '100vh' }}>
      <header
        className="App-header"
        style={{
          background: '#2563eb',
          color: '#fff',
          padding: '24px 0 12px 0',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <h1 style={{ fontWeight: 700, fontSize: 32, margin: '0 0 8px 0', letterSpacing: 1 }}>
          Кафе "Возера"
        </h1>
        <nav
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            marginBottom: 0,
          }}
        >
          <button
            onClick={() => setPage('menu')}
            style={{
              background: page === 'menu' ? '#fff' : '#3b82f6',
              color: page === 'menu' ? '#2563eb' : '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: page === 'menu' ? '0 2px 8px 0 rgba(0,0,0,0.06)' : undefined,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Меню
          </button>
          <button
            onClick={() => setPage('cart')}
            style={{
              background: page === 'cart' ? '#fff' : '#3b82f6',
              color: page === 'cart' ? '#2563eb' : '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: page === 'cart' ? '0 2px 8px 0 rgba(0,0,0,0.06)' : undefined,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Корзина
          </button>
          <button
            onClick={() => setPage('order')}
            style={{
              background: page === 'order' ? '#fff' : '#3b82f6',
              color: page === 'order' ? '#2563eb' : '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: page === 'order' ? '0 2px 8px 0 rgba(0,0,0,0.06)' : undefined,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Оформить заказ
          </button>
        </nav>
      </header>
      <main
        style={{
          padding: 24,
          maxWidth: 1200,
          margin: '0 auto',
          marginTop: 24,
          borderRadius: 16,
          background: '#f9fafb',
          minHeight: 400,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
        }}
      >
        {page === 'menu' && <Menu />}
        {page === 'cart' && <Cart />}
        {page === 'order' && <Order />}
      </main>
    </div>
  );
}

export default App;
