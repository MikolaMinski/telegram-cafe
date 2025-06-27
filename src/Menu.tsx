import React, { useEffect, useState } from 'react';
import { useCart, Product } from './CartContext';

const MENU_API_URL = 'https://cafevozeraapi.somee.com/api/Menu';///

// Буферизация меню на уровне модуля (одна загрузка за сессию)
let menuCache: Product[] | null = null;
let menuCacheError: string | null = null;

const Menu: React.FC = () => {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const [dishes, setDishes] = useState<Product[]>(menuCache || []);
  const [loading, setLoading] = useState(menuCache === null && menuCacheError === null);
  const [error, setError] = useState<string | null>(menuCacheError);

  useEffect(() => {
    if (menuCache !== null || menuCacheError !== null) {
      // Уже загружено или была ошибка — не грузим снова
      return;
    }
    setLoading(true);
    fetch(MENU_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки меню');
        return res.json();
      })
      .then((data) => {
        menuCache = data;
        menuCacheError = null;
        setDishes(data);
        setError(null);
      })
      .catch((e) => {
        const msg =
          e instanceof TypeError && e.message === 'Failed to fetch'
            ? 'Не удалось загрузить меню. Ошибка сервера.'
            : e.message;
        menuCache = [];
        menuCacheError = msg;
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const getQuantity = (id: number) => cart.find((item) => item.id === id)?.quantity || 0;

  if (loading)
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#2563eb',
          fontWeight: 600,
          fontSize: 22,
          marginTop: 48,
        }}
      >
        Загрузка меню...
      </div>
    );
  if (error)
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#f87171',
          fontWeight: 600,
          fontSize: 20,
          marginTop: 48,
        }}
      >
        {error}
      </div>
    );

  return (
    <div
      className="menu-list"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 24,
        justifyContent: 'center',
        alignItems: 'stretch',
        margin: '0 auto',
        maxWidth: 1200,
        padding: '16px 0',
      }}
    >
      {dishes.map((dish) => (
        <div
          key={dish.id}
          className="menu-card-modern"
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'box-shadow 0.2s',
            position: 'relative',
            minHeight: 340,
          }}
        >
          {dish.image && (
            <img
              src={dish.image}
              alt={dish.name}
              style={{
                width: 110,
                height: 110,
                objectFit: 'cover',
                borderRadius: 12,
                marginBottom: 18,
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
                background: '#f5f5f5',
              }}
            />
          )}
          <h3
            style={{
              fontSize: 20,
              fontWeight: 600,
              margin: '0 0 8px 0',
              color: '#222',
              textAlign: 'center',
              minHeight: 48,
              lineHeight: 1.2,
            }}
          >
            {dish.name}
          </h3>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: '#3b82f6',
              marginBottom: 18,
              letterSpacing: 0.2,
            }}
          >
            {dish.price} <span style={{ fontWeight: 400, color: '#888' }}>BYN</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginTop: 'auto',
            }}
          >
            <button
              onClick={() => decreaseQuantity(dish.id)}
              disabled={getQuantity(dish.id) === 0}
              style={{
                border: 'none',
                background: getQuantity(dish.id) === 0 ? '#e5e7eb' : '#f3f4f6',
                color: '#222',
                borderRadius: 8,
                width: 36,
                height: 36,
                fontSize: 22,
                fontWeight: 600,
                cursor: getQuantity(dish.id) === 0 ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
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
              }}
            >
              {getQuantity(dish.id)}
            </span>
            <button
              onClick={() =>
                getQuantity(dish.id) === 0 ? addToCart(dish) : increaseQuantity(dish.id)
              }
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
                transition: 'background 0.15s',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
              }}
              aria-label="Увеличить количество"
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
