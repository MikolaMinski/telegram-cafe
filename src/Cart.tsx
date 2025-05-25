import React from 'react';
import { useCart } from './CartContext';

const Cart = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) return <div>Корзина пуста</div>;

  return (
    <div>
      <h2>Корзина</h2>
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {cart.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: 12,
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
              {item.name} — {item.price * item.quantity} BYN
            </span>
            <button onClick={() => decreaseQuantity(item.id)}>-</button>
            <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
            <button onClick={() => increaseQuantity(item.id)}>+</button>
            <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 8 }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <div>Итого: {total} BYN</div>
      <button onClick={clearCart}>Очистить корзину</button>
    </div>
  );
};

export default Cart;
