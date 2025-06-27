import React, { useEffect, useState } from 'react';
import { useCart, Product } from './CartContext';

const MENU_API_URL = 'https://cafevozeraapi.somee.com/api/Menu'; // замените на ваш API

const Menu: React.FC = () => {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const [dishes, setDishes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(MENU_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки меню');
        return res.json();
      })
      .then(setDishes)
      .catch((e) => {
        if (e instanceof TypeError && e.message === 'Failed to fetch') {
          setError('Не удалось загрузить меню. Ошибка сервера.');
        } else {
          setError(e.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getQuantity = (id: number) => cart.find((item) => item.id === id)?.quantity || 0;

  if (loading) return <div>Загрузка меню...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
          {dish.image && (
            <img src={dish.image} alt={dish.name} style={{ width: 96, height: 96 }} />
          )}
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
