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

  const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   if (window.Telegram && window.Telegram.WebApp) {
  //     window.Telegram.WebApp.ready();
  //     const tgUser = window.Telegram.WebApp.initDataUnsafe?.user || null;
  //     setUser(tgUser);
  //     window.Telegram.WebApp.expand();
  //     console.log("User:", tgUser);
  //   }
  // }, []);

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
      <h2>Test User:</h2>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>Пользователь Telegram не найден</p>
      )}
    </div>
  );
}

export default App;
