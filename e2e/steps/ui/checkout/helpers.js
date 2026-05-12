export function computeSubtotal(cartItems) {
  return cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
}

export function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}
