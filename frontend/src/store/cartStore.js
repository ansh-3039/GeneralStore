import { create } from 'zustand';

const getInitialCart = () => {
  const savedCart = localStorage.getItem('cartItems');
  return savedCart ? JSON.parse(savedCart) : [];
};

export const useCartStore = create((set, get) => ({
  cartItems: getInitialCart(),

  addToCart: (product, qty = 1) => {
    const currentItems = get().cartItems;
    const existItem = currentItems.find(item => item._id === product._id);

    let newItems;
    if (existItem) {
      newItems = currentItems.map(item =>
        item._id === product._id ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      newItems = [...currentItems, { ...product, qty }];
    }

    localStorage.setItem('cartItems', JSON.stringify(newItems));
    set({ cartItems: newItems });
  },

  removeFromCart: (id) => {
    const newItems = get().cartItems.filter(item => item._id !== id);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    set({ cartItems: newItems });
  },

  updateQuantity: (id, qty) => {
    if (qty <= 0) return;
    const newItems = get().cartItems.map(item =>
      item._id === id ? { ...item, qty } : item
    );
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    set({ cartItems: newItems });
  },

  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cartItems: [] });
  }
}));
