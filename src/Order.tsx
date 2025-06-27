import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

const API_URL = 'https://cafevozeraapi.somee.com/api/Message/MakeOrder';

const Order = () => {
  const { cart, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orderType, setOrderType] = useState<'asap' | 'datetime'>(() => {
    return (localStorage.getItem('orderType') as 'asap' | 'datetime') || 'asap';
  });
  const [date, setDate] = useState(() => localStorage.getItem('orderDate') || '');
  const [time, setTime] = useState(() => localStorage.getItem('orderTime') || '');

  useEffect(() => {
    localStorage.setItem('orderType', orderType);
    if (orderType === 'datetime') {
      localStorage.setItem('orderDate', date);
      localStorage.setItem('orderTime', time);
    } else {
      localStorage.removeItem('orderDate');
      localStorage.removeItem('orderTime');
    }
  }, [orderType, date, time]);

  const handleOrder = async () => {
    setLoading(true);
    setError(null);
    let telegramUserId: number | undefined;
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.initDataUnsafe &&
      window.Telegram.WebApp.initDataUnsafe.user
    ) {
      telegramUserId = window.Telegram.WebApp.initDataUnsafe.user.id;
    }
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
          orderType,
          ...(orderType === 'datetime' ? { date, time } : {}),
          telegramUserId,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка сервера:', errorText);
        throw new Error('Ошибка при отправке заказа: ' + errorText);
      }
      setSubmitted(true);
      clearCart();
    } catch (e: any) {
      setError(
        e instanceof TypeError && e.message === 'Failed to fetch'
          ? 'Не удалось подключиться к серверу. Проверьте интернет или попробуйте позже.'
          : e.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#2563eb',
          fontWeight: 700,
          fontSize: 24,
          marginTop: 48,
        }}
      >
        Спасибо за заказ! Мы свяжемся с вами.
      </div>
    );

  if (cart.length === 0)
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#888',
          fontSize: 20,
          marginTop: 32,
        }}
      >
        Корзина пуста
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 520,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)',
        padding: 32,
      }}
    >
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 24, color: '#222' }}>
        Оформление заказа
      </h2>
      <div style={{ marginBottom: 24, display: 'flex', gap: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
          <input
            type="radio"
            name="orderType"
            value="asap"
            checked={orderType === 'asap'}
            onChange={() => setOrderType('asap')}
            style={{ accentColor: '#2563eb', width: 18, height: 18 }}
          />
          Как можно быстрее
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
          <input
            type="radio"
            name="orderType"
            value="datetime"
            checked={orderType === 'datetime'}
            onChange={() => setOrderType('datetime')}
            style={{ accentColor: '#2563eb', width: 18, height: 18 }}
          />
          На дату и время
        </label>
      </div>
      {orderType === 'datetime' && (
        <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              marginRight: 8,
              border: '1px solid #d1d5db',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 16,
              fontWeight: 500,
              color: '#222',
              background: '#f9fafb',
            }}
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 16,
              fontWeight: 500,
              color: '#222',
              background: '#f9fafb',
            }}
          />
        </div>
      )}
      <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 24 }}>
        {cart.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#f3f4f6',
              borderRadius: 8,
              padding: 10,
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: 'cover',
                  borderRadius: 6,
                  marginRight: 8,
                  background: '#fff',
                }}
              />
            )}
            <span style={{ flex: 1, fontWeight: 500, fontSize: 17, color: '#222' }}>
              {item.name} × {item.quantity}
            </span>
            <span style={{ fontWeight: 600, fontSize: 17, color: '#2563eb' }}>
              {item.price * item.quantity} BYN
            </span>
          </li>
        ))}
      </ul>
      <div
        style={{
          fontWeight: 700,
          fontSize: 20,
          color: '#222',
          marginBottom: 28,
          textAlign: 'right',
        }}
      >
        Итог:{' '}
        <span style={{ color: '#2563eb' }}>
          {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} BYN
        </span>
      </div>
      <button
        onClick={handleOrder}
        disabled={loading || (orderType === 'datetime' && (!date || !time))}
        style={{
          width: '100%',
          background: loading ? '#93c5fd' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '16px 0',
          fontWeight: 700,
          fontSize: 20,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 1px 6px 0 rgba(0,0,0,0.04)',
          transition: 'background 0.15s',
        }}
      >
        {loading ? 'Отправка...' : 'Заказать'}
      </button>
      {error && (
        <div style={{ color: '#f87171', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Order;
