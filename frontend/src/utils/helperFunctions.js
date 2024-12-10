export function addDecimals(num) {
  return Math.round((num * 100) / 100).toFixed(2);
}

export function updateCart(state) {
  // Calculate items total price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  // Calculate shipping price (If order is over $100, else $10 shipping)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // Calculate total price
  state.totalPrice = addDecimals(+state.itemsPrice + +state.shippingPrice);

  // Save the whole state to local storage
  localStorage.setItem("cart", JSON.stringify(state));
}
