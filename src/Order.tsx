import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

const API_URL = 'https://your-api-endpoint.example.com/order'; // замените на ваш API

const Order = () => {
  const { cart, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Отправка заказа на API
  const handleOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      });
      if (!response.ok) throw new Error('Ошибка при отправке заказа');
      setSubmitted(true);
      clearCart();
    } catch (e: any) {
      setError(e.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <div>Спасибо за заказ! Мы свяжемся с вами.</div>;

  if (cart.length === 0) return <div>Корзина пуста</div>;

  return (
    <div>
      <h2>Оформление заказа</h2>
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {cart.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: 10,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ flex: 1 }}>
              {item.name} × {item.quantity}
            </span>
            <span>{item.price * item.quantity} BYN</span>
          </li>
        ))}
      </ul>
      <div>
        Итог: {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} BYN
      </div>
      <button onClick={handleOrder} disabled={loading}>
        {loading ? 'Отправка...' : 'Заказать'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default Order;
