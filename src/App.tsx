import React, { useState, useEffect, use } from 'react';
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

  var user = undefined;

  // Telegram WebApp integration
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      user = window.Telegram.WebApp.initDataUnsafe.user;
      window.Telegram.WebApp.expand();
      console.log("User:",user);
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
        <h1>Test: {user}</h1>
    </div>
  );
}

export default App;
