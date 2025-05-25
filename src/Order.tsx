import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

const API_URL = 'https://your-api-endpoint.example.com/order'; // замените на ваш API

const Order = () => {
  const { cart, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Новый стейт для типа заказа и даты/времени
  const [orderType, setOrderType] = useState<'asap' | 'datetime'>(() => {
    return (localStorage.getItem('orderType') as 'asap' | 'datetime') || 'asap';
  });
  const [date, setDate] = useState(() => localStorage.getItem('orderDate') || '');
  const [time, setTime] = useState(() => localStorage.getItem('orderTime') || '');

  // Сохраняем значения в localStorage при изменении
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
          orderType,
          ...(orderType === 'datetime' ? { date, time } : {}),
        }),
      });
      if (!response.ok) throw new Error('Ошибка при отправке заказа');
      setSubmitted(true);
      clearCart();
    } catch (e: any) {
      setError(
        e instanceof TypeError && e.message === 'Failed to fetch'
          ? 'Не удалось подключиться к серверу. Проверьте интернет или попробуйте позже.'
          : 'Произошла ошибка при оформлении заказа. Попробуйте ещё раз.'
      );
      // Для отладки можно раскомментировать следующую строку:
      // console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <div>Спасибо за заказ! Мы свяжемся с вами.</div>;

  if (cart.length === 0) return <div>Корзина пуста</div>;

  return (
    <div>
      <h2>Оформление заказа</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="radio"
            name="orderType"
            value="asap"
            checked={orderType === 'asap'}
            onChange={() => setOrderType('asap')}
          />
          Как можно быстрее
        </label>
        <label style={{ marginLeft: 16 }}>
          <input
            type="radio"
            name="orderType"
            value="datetime"
            checked={orderType === 'datetime'}
            onChange={() => setOrderType('datetime')}
          />
          На дату и время
        </label>
      </div>
      {orderType === 'datetime' && (
        <div style={{ marginBottom: 16 }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>
      )}
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
            {/* Картинка блюда */}
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, marginRight: 8 }}
              />
            )}
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
      <button
        onClick={handleOrder}
        disabled={loading || (orderType === 'datetime' && (!date || !time))}
      >
        {loading ? 'Отправка...' : 'Заказать'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default Order;
