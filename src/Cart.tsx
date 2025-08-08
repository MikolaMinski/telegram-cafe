import React from 'react';
import { useCart } from './CartContext';

const Cart = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

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
    <div>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 24, color: '#222' }}>Корзина</h2>
      <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
        {cart.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 1px 6px 0 rgba(0,0,0,0.04)',
              padding: 16,
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'cover',
                  borderRadius: 8,
                  background: '#f3f4f6',
                  marginBottom: 12,
                }}
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 18, color: '#222', wordBreak: 'break-word' }}>
                {item.name}
                <span style={{ color: '#888', fontWeight: 400, marginLeft: 8 }}>× {item.quantity}</span>
              </span>
              <span style={{ fontWeight: 600, fontSize: 18, color: '#2563eb', minWidth: 70, textAlign: 'right' }}>
                {(item.price * item.quantity).toFixed(2)} BYN
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <button
                onClick={() => decreaseQuantity(item.id)}
                style={{
                  border: 'none',
                  background: '#f3f4f6',
                  color: '#222',
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  fontSize: 22,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                aria-label="Уменьшить количество"
              >
                −
              </button>
              <span
                style={{
                  minWidth: 32,
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 500,
                  color: '#222',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => increaseQuantity(item.id)}
                style={{
                  border: 'none',
                  background: '#3b82f6',
                  color: '#fff',
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  fontSize: 22,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                aria-label="Увеличить количество"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  border: 'none',
                  background: '#f87171',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div
        style={{
          fontWeight: 700,
          fontSize: 22,
          color: '#222',
          marginTop: 24,
          textAlign: 'right',
        }}
      >
        Итого: <span style={{ color: '#2563eb' }}>{total} BYN</span>
      </div>
      <button
        onClick={clearCart}
        style={{
          marginTop: 24,
          background: '#f87171',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '12px 32px',
          fontWeight: 700,
          fontSize: 18,
          cursor: 'pointer',
          float: 'right',
          boxShadow: '0 1px 6px 0 rgba(0,0,0,0.04)',
        }}
      >
        Очистить корзину
      </button>
    </div>
  );
};

export default Cart;
