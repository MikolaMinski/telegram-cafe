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
          color: '#059669',
          fontWeight: 700,
          fontSize: 26,
          marginTop: 60,
          letterSpacing: 0.5,
        }}
      >
        <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🎉</span>
        Спасибо за заказ!<br />Мы свяжемся с вами.
      </div>
    );

  if (cart.length === 0)
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#888',
          fontSize: 22,
          marginTop: 40,
          letterSpacing: 0.2,
        }}
      >
        Корзина пуста
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 540,
        margin: '0 auto',
        background: '#f9fafb',
        borderRadius: 18,
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
        padding: 36,
        border: '1.5px solid #e5e7eb',
      }}
    >
      <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 28, color: '#222', letterSpacing: 0.5 }}>
        Оформление заказа
      </h2>
      <div style={{ marginBottom: 28, display: 'flex', gap: 32 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, color: '#2563eb' }}>
          <input
            type="radio"
            name="orderType"
            value="asap"
            checked={orderType === 'asap'}
            onChange={() => setOrderType('asap')}
            style={{ accentColor: '#2563eb', width: 20, height: 20 }}
          />
          Как можно быстрее
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, color: '#2563eb' }}>
          <input
            type="radio"
            name="orderType"
            value="datetime"
            checked={orderType === 'datetime'}
            onChange={() => setOrderType('datetime')}
            style={{ accentColor: '#2563eb', width: 20, height: 20 }}
          />
          На дату и время
        </label>
      </div>
      {orderType === 'datetime' && (
        <div style={{ marginBottom: 28, display: 'flex', gap: 18 }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              border: '1.5px solid #d1d5db',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 17,
              fontWeight: 500,
              color: '#222',
              background: '#fff',
              minWidth: 120,
            }}
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              border: '1.5px solid #d1d5db',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 17,
              fontWeight: 500,
              color: '#222',
              background: '#fff',
              minWidth: 100,
            }}
          />
        </div>
      )}
      <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 28 }}>
        {cart.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: '#f3f4f6',
              borderRadius: 10,
              padding: 12,
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 44,
                  height: 44,
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginRight: 8,
                  background: '#fff',
                  boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
                }}
              />
            )}
            <span style={{ flex: 1, fontWeight: 600, fontSize: 18, color: '#222' }}>
              {item.name} <span style={{ color: '#888', fontWeight: 400 }}>× {item.quantity}</span>
            </span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#2563eb' }}>
              {item.price * item.quantity} BYN
            </span>
          </li>
        ))}
      </ul>
      <div
        style={{
          fontWeight: 800,
          fontSize: 22,
          color: '#222',
          marginBottom: 32,
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
          borderRadius: 12,
          padding: '18px 0',
          fontWeight: 800,
          fontSize: 22,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 1px 8px 0 rgba(0,0,0,0.04)',
          transition: 'background 0.15s',
          letterSpacing: 0.5,
        }}
      >
        {loading ? 'Отправка...' : 'Заказать'}
      </button>
      {error && (
        <div style={{ color: '#f87171', marginTop: 22, textAlign: 'center', fontWeight: 600, fontSize: 17 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Order;
