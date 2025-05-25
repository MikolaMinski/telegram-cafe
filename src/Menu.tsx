import React from 'react';
import { useCart, Product } from './CartContext';

const dishes: (Product & { image: string })[] = [
  {
    id: 1,
    name: 'Пицца Маргарита',
    price: 450,
    image: 'https://img.icons8.com/color/96/000000/pizza.png',
  },
  {
    id: 2,
    name: 'Борщ',
    price: 250,
    image: 'https://img.icons8.com/color/96/000000/borscht.png',
  },
  {
    id: 3,
    name: 'Суши сет',
    price: 700,
    image: 'https://img.icons8.com/color/96/000000/sushi.png',
  },
];

const Menu: React.FC = () => {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const getQuantity = (id: number) => cart.find((item) => item.id === id)?.quantity || 0;

  return (
    <div
      style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {dishes.map((dish) => (
        <div
          key={dish.id}
          style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 16,
            width: 220,
            textAlign: 'center',
            background: '#fafafa',
            marginBottom: 16,
            maxWidth: '100%',
          }}
          className="menu-card"
        >
          <img src={dish.image} alt={dish.name} style={{ width: 96, height: 96 }} />
          <h3>{dish.name}</h3>
          <p>{dish.price} ₽</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <button
              onClick={() => decreaseQuantity(dish.id)}
              disabled={getQuantity(dish.id) === 0}
            >
              -
            </button>
            <span style={{ minWidth: 24, display: 'inline-block' }}>{getQuantity(dish.id)}</span>
            <button
              onClick={() =>
                getQuantity(dish.id) === 0 ? addToCart(dish) : increaseQuantity(dish.id)
              }
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
