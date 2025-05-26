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

  // Telegram WebApp integration
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Кафе "Возера"</h1>
        <nav>
          <button onClick={() => setPage('menu')}>Меню</button>
          <button onClick={() => setPage('cart')}>Корзина</button>
          <button onClick={() => setPage('order')}>Оформить заказ</button>
        </nav>
      </header>
      <main style={{ padding: 20 }}>
        {page === 'menu' && <Menu />}
        {page === 'cart' && <Cart />}
        {page === 'order' && <Order />}
      </main>
    </div>
  );
}

export default App;
