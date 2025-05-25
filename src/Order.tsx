import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

declare global {
  interface Window {
    Telegram?: any;
  }
}

const Order = () => {
  const { cart, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  // Telegram WebApp MainButton integration
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    if (cart.length > 0 && !submitted) {
      tg.MainButton.setText('Отправить заказ');
      tg.MainButton.show();
      const onClick = () => handleOrder();
      tg.MainButton.onClick(onClick);
      return () => {
        tg.MainButton.offClick(onClick);
        tg.MainButton.hide();
      };
    } else {
      tg.MainButton.hide();
    }
  }, [cart, submitted]);

  const handleOrder = () => {
    setSubmitted(true);
    clearCart();

    // Отправка данных заказа в Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.sendData(
        JSON.stringify({
          order: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        })
      );
      tg.MainButton.hide();
    }
  };

  if (submitted) return <div>Спасибо за заказ! Мы свяжемся с вами в Telegram.</div>;

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
          </li>
        ))}
      </ul>
      <button onClick={handleOrder}>Заказать</button>
      <div style={{ marginTop: 16, color: '#888', fontSize: 14 }}>
        Или используйте кнопку Telegram внизу экрана
      </div>
    </div>
  );
};

export default Order;
