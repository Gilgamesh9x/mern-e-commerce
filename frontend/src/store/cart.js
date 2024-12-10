import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/helperFunctions";

// if we already stored cart items, get them from local storage
// This way if somebody leaves the page, the cart will be saved
const initialCartState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
      itemsPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
      cartItemsQuantity: 0,
      shippingAddress: {},
    };

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addToCart(state, action) {
      const itemToAdd = action.payload;
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem._id === itemToAdd._id
      );
      if (!existingItem) {
        state.cartItems.push({
          ...itemToAdd,
        });
      } else {
        existingItem.quantity = itemToAdd.quantity;
      }
      state.cartItemsQuantity = state.cartItems.reduce(
        (acc, item) => item.quantity + acc,
        0
      );

      updateCart(state);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== id);
      state.cartItemsQuantity = state.cartItems.reduce(
        (acc, item) => item.quantity + acc,
        0
      );
      updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItemsQuantity = 0;
      state.cartItems = [];
      updateCart(state);
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
