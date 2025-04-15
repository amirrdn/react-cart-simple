import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../types/cart';

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                item => item.barang_id === action.payload.barang_id
            );

            if (existingItem) {
                existingItem.jumlah += action.payload.jumlah;
                existingItem.subtotal = existingItem.jumlah * existingItem.harga_satuan;
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.barang_id !== action.payload);
        },
        updateCartItemQuantity: (state, action: PayloadAction<{ barangId: number; jumlah: number }>) => {
            const item = state.items.find(item => item.barang_id === action.payload.barangId);
            if (item) {
                item.jumlah = action.payload.jumlah;
                item.subtotal = item.jumlah * item.harga_satuan;
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 