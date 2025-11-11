export function loadCart() {
  const cart = localStorage.getItem("cart");
  if (cart !== null) { // fixed !==
    return JSON.parse(cart);
  } else {
    return [];
  }
}

export function addToCart(key, qty) {
  const cart = loadCart();

  const index = cart.findIndex((item) => {
    return item.key === key; // fixed ===
  });
  console.log(index);
  if (index === -1) { // fixed ===
    cart.push({ key, qty });
  } else {
    const newQty = cart[index].qty + qty;
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
  }
  saveCart(cart);
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem("cart");
}

export function removeFromCart(key) {
  const cart = loadCart();

  const index = cart.findIndex((item) => {
    return item.key === key; // fixed ===
  });

  if (index !== -1) { // fixed !==
    cart.splice(index, 1);
    saveCart(cart);
  }
}

export function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
