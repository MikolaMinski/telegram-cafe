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
  {
    id: 4,
    name: 'Цезарь с курицей',
    price: 320,
    image: 'https://img.icons8.com/color/96/000000/salad.png',
  },
  {
    id: 5,
    name: 'Бургер классический',
    price: 390,
    image: 'https://img.icons8.com/color/96/000000/hamburger.png',
  },
  {
    id: 6,
    name: 'Картофель фри',
    price: 150,
    image: 'https://img.icons8.com/color/96/000000/french-fries.png',
  },
  {
    id: 7,
    name: 'Паста Карбонара',
    price: 410,
    image: 'https://img.icons8.com/color/96/000000/spaghetti.png',
  },
  {
    id: 8,
    name: 'Шашлык из свинины',
    price: 600,
    image: 'https://img.icons8.com/color/96/000000/barbecue.png',
  },
  {
    id: 9,
    name: 'Оливье',
    price: 270,
    image: 'https://img.icons8.com/color/96/000000/olivier-salad.png',
  },
  {
    id: 10,
    name: 'Пельмени',
    price: 330,
    image: 'https://img.icons8.com/color/96/000000/dumplings.png',
  },
  {
    id: 11,
    name: 'Куриный суп',
    price: 220,
    image: 'https://img.icons8.com/color/96/000000/chicken-soup.png',
  },
  {
    id: 12,
    name: 'Греческий салат',
    price: 290,
    image: 'https://img.icons8.com/color/96/000000/greek-salad.png',
  },
  {
    id: 13,
    name: 'Ролл Филадельфия',
    price: 480,
    image: 'https://img.icons8.com/color/96/000000/salmon-sushi.png',
  },
  {
    id: 14,
    name: 'Котлета по-киевски',
    price: 370,
    image: 'https://img.icons8.com/color/96/000000/chicken-leg.png',
  },
  {
    id: 15,
    name: 'Сырники',
    price: 210,
    image: 'https://img.icons8.com/color/96/000000/cheesecake.png',
  },
  {
    id: 16,
    name: 'Блины с творогом',
    price: 200,
    image: 'https://img.icons8.com/color/96/000000/pancake.png',
  },
  {
    id: 17,
    name: 'Стейк говяжий',
    price: 850,
    image: 'https://img.icons8.com/color/96/000000/steak.png',
  },
  {
    id: 18,
    name: 'Салат с тунцом',
    price: 340,
    image: 'https://img.icons8.com/color/96/000000/tuna-salad.png',
  },
  {
    id: 19,
    name: 'Морс клюквенный',
    price: 90,
    image: 'https://img.icons8.com/color/96/000000/juice.png',
  },
  {
    id: 20,
    name: 'Чизкейк Нью-Йорк',
    price: 260,
    image: 'https://img.icons8.com/color/96/000000/cake.png',
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
          <p>{dish.price} BYN</p>
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
